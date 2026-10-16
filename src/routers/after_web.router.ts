import { AgentStateType } from 'src/state/state';

export function routeAfterWeb(state: AgentStateType) {
  if (state.web_grade === 'good') {
    return 'generate_from_web';
  }
  if (state.retry_count < 2) {
    return 'rewrite_query';
  }
  return 'insufficient';
}
