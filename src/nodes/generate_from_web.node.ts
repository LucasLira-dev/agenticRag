import { getLlm } from 'src/llm.factory';
import { AgentStateType } from 'src/state/state';
import { routeAddTrace } from '../routers/add_trace.router';

export function buildGenerateFromWebNode() {
  return async (state: AgentStateType) => {
    const answer = await getLlm('gemini-2.5-flash-lite').invoke(
      `You are an enterprise IT support copilot. The private company KB was insufficient.
Answer ONLY from the web evidence below. Clearly say this is external web information and may need IT validation before changing company-managed systems.
Question: ${state['question']}\n\nWeb evidence:\n${state['web_results']}`,
    );

    const answerContent =
      typeof answer.content === 'string'
        ? answer.content.trim()
        : JSON.stringify(answer.content).trim();

    return {
      answer: answerContent,
      source_used: 'web_search',
      trace: routeAddTrace(state, `Answer generated from web evidence`),
    };
  };
}
