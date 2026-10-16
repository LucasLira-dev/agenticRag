import { AgentStateType } from 'src/state/state';
import { routeAddTrace } from '../routers/add_trace.router';

export function buildInsufficientNode(state: AgentStateType) {
  return {
    answer:
      "I couldn't find enough reliable evidence in the company knowledge base or external search to answer confidently. Please contact the IT help desk or provide more details.",
    source_used: 'insufficient_evidence',
    trace: routeAddTrace(state, `Insufficient evidence to answer the question`),
  };
}
