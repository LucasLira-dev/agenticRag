import { getLlm } from 'src/llm.factory';
import { AgentStateType } from 'src/state/state';

export function buildDirectAnswerNode() {
  return async (state: AgentStateType) => {
    const answer = await getLlm('qwen/qwen3.8-27b').invoke(
      `"Respond briefly and naturally to: ${state['question']}`,
    );

    const answerContent =
      typeof answer.content === 'string'
        ? answer.content.trim()
        : JSON.stringify(answer.content).trim();

    return {
      answer: answerContent,
      source_used: 'direct_answer',
      trace: `Direct answer generated from LLM`,
    };
  };
}
