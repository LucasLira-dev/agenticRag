import { getRetriever } from 'src/rag/vectorstore';
import { AgentStateType } from 'src/state/state';
import { routeAddTrace } from '../routers/add_trace.router';

export async function buildRetrieveKbNode(state: AgentStateType) {
  const retriever = await getRetriever();

  const docs = await retriever.invoke(state.current_query);

  return {
    kb_docs: docs,
    trace: routeAddTrace(
      state,
      `Private KB retrieval -> ${docs.length} chunks`,
    ),
  };
}
