import { AgentStateType } from 'src/state/state';

export function RouteAfterRouter(state: AgentStateType) {
  if (state.source_used === 'kb') {
    return 'retrieve_kb';
  } else {
    return 'direct_answer';
  }
}
