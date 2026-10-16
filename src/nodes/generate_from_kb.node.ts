import { getLlm } from 'src/llm.factory';
import { AgentStateType } from 'src/state/state';
import { routeAddTrace } from '../routers/add_trace.router';

export function BuildGenerateFromKbNode() {
  return async (state: AgentStateType) => {
    let context = '';

    for (const doc of state.kb_docs) {
      context = `Source: ${doc.metadata.source ?? 'unknown'}\nContent: ${doc.pageContent}`;
    }

    const asnwer = await getLlm('gemini-2.5-flash-lite').invoke(
      `You are an enterprise IT support copilot. Answer ONLY from the private company KB below.
Be concise, actionable, and safe. If steps are present, present them clearly.
Do not invent policy details. Mention that the answer is based on the company's private knowledge base.
Question: ${state['question']}\n\nPrivate KB:\n${context}`,
    );

    const answerContent =
      typeof asnwer.content === 'string'
        ? asnwer.content.trim()
        : JSON.stringify(asnwer.content).trim();

    const citations: { title: string; url: string; type: string }[] = [];
    const seen = new Set();

    for (const doc of state.kb_docs) {
      const src = (doc.metadata.source as string | undefined) ?? 'Private KB';
      if (!seen.has(src)) {
        seen.add(src);
        citations.push({
          title: src.split('/')[-1],
          url: '',
          type: 'private_kb',
        });
      }
    }

    return {
      answer: answerContent,
      source_used: 'private_kb',
      citations,
      trace: routeAddTrace(state, `Answer generated from private KB`),
    };
  };
}
