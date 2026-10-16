import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';
import { BadRequestException } from '@nestjs/common';

const llmCache = new Map<string, BaseChatModel>();

export type ModelProvider = 'google' | 'groq' | 'openrouter';

export interface ModelDefinition {
  id: string;
  provider: ModelProvider;
  label: string;
}

export const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

export const FREE_MODELS: ModelDefinition[] = [
  {
    id: 'gemini-2.5-flash',
    provider: 'google',
    label: 'Gemini 2.5 Flash',
  },
  {
    id: 'gemini-2.5-flash-lite',
    provider: 'google',
    label: 'Gemini 2.5 Flash Lite',
  },
  {
    id: 'gemini-3.1-flash-lite',
    provider: 'google',
    label: 'Gemini 3.1 Flash Lite',
  },
  {
    id: 'gemini-3.5-flash',
    provider: 'google',
    label: 'Gemini 3.5 Flash',
  },
  {
    id: 'openai/gpt-oss-120b',
    provider: 'groq',
    label: 'GPT-OSS 120B (Groq)',
  },
  {
    id: 'openai/gpt-oss-20b',
    provider: 'groq',
    label: 'GPT-OSS 20B (Groq)',
  },
  {
    id: 'qwen/qwen3.6-27b',
    provider: 'groq',
    label: 'Qwen3.6 27B (Groq)',
  },
  {
    id: 'qwen/qwen3.8-27b',
    provider: 'groq',
    label: 'Qwen3.8 27B (Groq)',
  },
];

export function isModelAllowed(id: string): boolean {
  return FREE_MODELS.some((m) => m.id === id);
}

export function getModelDefinition(id: string): ModelDefinition {
  const def = FREE_MODELS.find((m) => m.id === id);
  if (!def) {
    throw new BadRequestException(`Modelo não suportado: ${id}`);
  }
  return def;
}

export const DEFAULT_MAX_TOKENS = 8_192;

export function getLlm(
  modelId: string,
  options: { temperature?: number; maxTokens?: number } = {},
): BaseChatModel {
  const temperature = options.temperature ?? 0.4;
  // Sem maxTokens explicito o provedor assume a janela completa do modelo
  // (ex.: 131072 no OpenRouter) e a requisicao e rejeitada com 402 por saldo.
  const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;
  const cacheKey = `${modelId}:${temperature}:${maxTokens}`;

  const cached = llmCache.get(cacheKey);
  if (cached) return cached;

  const { provider } = getModelDefinition(modelId);

  let llm: BaseChatModel;

  switch (provider) {
    case 'google':
      llm = new ChatGoogleGenerativeAI({
        model: modelId,
        apiKey: process.env.GOOGLE_API_KEY,
        temperature,
        maxOutputTokens: maxTokens,
        maxRetries: 0,
      });
      break;

    case 'groq':
      llm = new ChatGroq({
        model: modelId,
        apiKey: process.env.GROQ_API_KEY,
        temperature,
        maxTokens,
        maxRetries: 0,
        timeout: 120_000,
      });
      break;

    default:
      throw new BadRequestException(`Provedor de modelo não suportado.`);
  }

  llmCache.set(cacheKey, llm);
  return llm;
}
