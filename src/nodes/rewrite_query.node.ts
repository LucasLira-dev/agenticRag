import { getLlm } from 'src/llm.factory';
import { AgentStateType } from 'src/state/state';
import { routeAddTrace } from '../routers/add_trace.router';

export function buildRewriteQueryNode() {
  return async (state: AgentStateType) => {
    const llm = getLlm('qwen/qwen3.6-27b');

    const rewrittenQuery = await llm.invoke(
      `Rewrite this IT support question for better private knowledge retrieval and vendor web search.
Preserve intent, add useful technical keywords, do not answer, return only the query.
Question: ${state['question']}`,
    );

    const rewrittenQueryContent =
      typeof rewrittenQuery.content === 'string'
        ? rewrittenQuery.content.trim()
        : JSON.stringify(rewrittenQuery.content).trim();

    return {
      current_query: rewrittenQueryContent,
      retry_count: state.retry_count + 1,
      trace: routeAddTrace(state, `Query rewrite → ${rewrittenQueryContent}`),
    };
  };
}
