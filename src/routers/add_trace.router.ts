import { AgentStateType } from 'src/state/state';

export const routeAddTrace = (state: AgentStateType, message: string) => {
  return [...(state.trace ?? []), message];
};
