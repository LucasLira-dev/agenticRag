import { AgentStateType } from 'src/state/state';

export function routeAfterKb(state: AgentStateType) {
  if (state.kb_grade === 'good') {
    return 'generate_from_kb';
  } else {
    return 'search_web';
  }
}
