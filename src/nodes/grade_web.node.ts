import { getLlm } from 'src/llm.factory';
import { EvidenceSchema } from 'src/schemas/evidenceSchema';
import { AgentStateType } from 'src/state/state';
import { routeAddTrace } from '../routers/add_trace.router';

export function buildGradeWebNode() {
  return async (state: AgentStateType) => {
    const grader = getLlm('openai/gpt-oss-20b').withStructuredOutput(
      EvidenceSchema,
      {
        method: 'jsonMode',
      },
    );

    const grade = await grader.invoke(
      `Question: ${state['question']}
Web evidence:\n${state['web_results']}
Return good if the evidence is sufficient and directly relevant; otherwise weak.
Return valid JSON like {{"grade":"good"}}.`,
    );

    return {
      web_grade: grade.grade,
      trace: routeAddTrace(
        state,
        `Web evidence grade → ${grade.grade.toUpperCase()}`,
      ),
    };
  };
}
