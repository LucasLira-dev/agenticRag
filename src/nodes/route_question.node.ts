import { getLlm } from 'src/llm.factory';
import { RouteSchema } from 'src/schemas/routeSchema';
import { AgentStateType } from 'src/state/state';
import { routeAddTrace } from '../routers/add_trace.router';

export function buildRouteQuestionNode() {
  return async (state: AgentStateType) => {
    const router = getLlm('openai/gpt-oss-120b').withStructuredOutput(
      RouteSchema,
      {
        method: 'jsonMode',
      },
    );
    const prompt = `You route messages for an enterprise IT support assistant.
        Use kb for questions about company IT policies, VPN, password reset, MFA, laptop setup,
        software access, security, email, devices, troubleshooting, or technology support.
        Use direct only for greetings, thanks, or casual chat that needs no company knowledge.
        Question: ${state.question}
        Return valid JSON like {{"route":"kb"}}.`;

    const decision = await router.invoke(prompt);

    return {
      source_used: decision.route,
      trace: routeAddTrace(state, `Router: ${decision.route.toUpperCase()}`),
    };
  };
}
