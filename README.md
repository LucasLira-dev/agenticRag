# Agentic RAG — NestJS + LangGraph

Uma API NestJS que expõe um **assistente de Agentic RAG (Retrieval-Augmented Generation)** para suporte de TI corporativo. Construída com [LangChain](https://js.langchain.com/) e [LangGraph](https://langchain-ai.github.io/langgraphjs/), o agente roteia cada pergunta, recupera evidências de uma base de conhecimento privada (Qdrant), avalia a qualidade delas e, quando a base é insuficiente, recorre à busca na web com reescrita de consulta. As respostas incluem citações e um trace passo a passo do raciocínio do agente.

## Como funciona

```
START → route_question
  ├─ (kb) → retrieve_kb → grade_kb
  │            ├─ good → generate_from_kb → END
  │            └─ weak → search_web → grade_web
  │                          ├─ good → generate_from_web → END
  │                          ├─ retry_count < 2 → rewrite_query → search_web (loop)
  │                          └─ else → insufficient → END
  └─ (direct) → direct_answer → END
```

- **route_question** — classifica a pergunta como relacionada à base de conhecimento ou como conversa casual (saída estruturada via schema Zod).
- **retrieve_kb** — busca por similaridade (top-3) na coleção do Qdrant.
- **grade_kb / grade_web** — um avaliador de evidência pontua se o material recuperado de fato sustenta uma resposta (`good` / `weak`).
- **generate_from_kb / generate_from_web** — geram a resposta final; respostas da base constroem citações a partir das fontes dos documentos.
- **rewrite_query** — quando os resultados web são fracos, reescreve a consulta e busca novamente (até 2 tentativas).
- **direct_answer** — lida com saudações e perguntas que não exigem recuperação.
- **insufficient** — fallback gracioso quando nem a base nem a web produzem evidência utilizável.

Cada nó acrescenta entradas a um array `trace[]`, de modo que todo o caminho de decisão fica visível na resposta.

### Modelos

| Função | Provedor | Modelo |
|---|---|---|
| Embeddings | Google | `gemini-embedding-001` (3072 dims) |
| Geração de resposta | Google | `gemini-2.5-flash-lite` (padrão) |
| Roteamento | Groq | `openai/gpt-oss-120b` |
| Avaliação de evidência | Groq | `openai/gpt-oss-20b` |
| Reescrita de consulta | Groq | `qwen/qwen3.6-27b` |
| Respostas diretas | Groq | `qwen/qwen3.8-27b` |

A seleção de modelos fica em `src/llm.factory.ts`; os modelos de cada nó estão definidos nos arquivos sob `src/nodes/`.

## Configuração do projeto

```bash
$ npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (não commite chaves reais):

| Variável | Obrigatória | Descrição |
|---|---|---|
| `QDRANT_URL` | sim | URL da instância Qdrant (Qdrant Cloud ou local, ex.: `http://localhost:6333`) |
| `QDRANT_API_KEY` | sim* | Chave de API (*não necessária em Qdrant local sem autenticação) |
| `QDRANT_COLLECTION_NAME` | não | Padrão: `agentic-rag` |
| `GOOGLE_API_KEY` | sim | Chave do Google AI Studio (Gemini LLM + embeddings) |
| `GROQ_API_KEY` | sim | Chave da Groq (roteador / avaliadores / reescrita) |
| `TAVILY_API_KEY` | sim | Chave Tavily para a ferramenta `internet_search` |
| `SAMPLE_KB_PATH` | não | Pasta da base de conhecimento para ingestão. Padrão: `src/data/sample_kb` |
| `PORT` | não | Padrão: `3000` |

### Popular a base de conhecimento

A ingestão lê todos os arquivos de `SAMPLE_KB_PATH` (suporta `.md`, `.txt`, `.pdf`, `.docx`), fatia o texto (`RecursiveCharacterTextSplitter`, 900 caracteres / 120 de sobreposição) e gera os embeddings no Qdrant. **Isso reseta a coleção** — execute antes do primeiro uso e sempre que quiser recarregar a base:

```bash
$ npm run ingest
```

A base de exemplo traz dois documentos fictícios da empresa "NovaRetail": `company_it_handbook.md` e `service_desk_runbook.md`.

> **Qdrant local (opcional):** em vez do Qdrant Cloud você pode rodar `docker run -p 6333:6333 qdrant/qdrant` e definir `QDRANT_URL=http://localhost:6333`.

## Compilar e executar o projeto

```bash
# desenvolvimento
$ npm run start

# modo watch
$ npm run start:dev

# produção
$ npm run start:prod
```

## API

### `POST /agent/ask`

Faz uma pergunta ao agente.

```bash
curl -X POST http://localhost:3000/agent/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "Como redefinir minha senha de VPN?"}'
```

Corpo da requisição:

```json
{ "question": "string" }
```

Resposta — estado final do agente:

```json
{
  "question": "Como redefinir minha senha de VPN?",
  "current_query": "Como redefinir minha senha de VPN?",
  "kb_docs": ["..."],
  "web_results": [],
  "kb_grade": "good",
  "web_grade": null,
  "answer": "...",
  "source_used": "kb",
  "retry_count": 0,
  "trace": ["route_question: kb", "retrieve_kb: 3 docs", "grade_kb: good", "generate_from_kb"],
  "citations": [{ "title": "...", "url": "...", "type": "kb" }]
}
```

### `GET /`

Health check — retorna `Hello World!`.

## Testes

```bash
# testes unitários
$ npm run test

# testes e2e
$ npm run test:e2e

# cobertura de testes
$ npm run test:cov
```

## Estrutura do projeto

```
src/
├── agent/          # Controller + service que compila e invoca o grafo LangGraph
├── nodes/          # Nós do grafo (rotear, recuperar, avaliar, gerar, reescrever, ...)
├── routers/        # Arestas condicionais entre nós + registro do trace
├── state/          # Tipo AgentState compartilhado pelo grafo
├── schemas/        # Schemas Zod para saída estruturada (roteamento, avaliação)
├── rag/            # Singleton do vectorstore Qdrant + script de ingestão
├── tools/          # Ferramentas LangChain (busca web Tavily)
├── data/sample_kb/ # Documentos de exemplo da base de conhecimento
└── llm.factory.ts  # Catálogo e instanciação de LLMs (Google / Groq)
```

## Deployment

Quando for implantar sua aplicação NestJS em produção, consulte a [documentação de deployment](https://docs.nestjs.com/deployment). Lembre-se de configurar todas as variáveis de ambiente necessárias e rodar `npm run ingest` contra a coleção Qdrant de produção antes de servir tráfego.

## Licença

UNLICENSED.
