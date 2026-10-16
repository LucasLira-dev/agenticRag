import { getLlm } from 'src/llm.factory';
import { EvidenceSchema } from 'src/schemas/evidenceSchema';
import { AgentStateType } from 'src/state/state';
import { routeAddTrace } from '../routers/add_trace.router';

export function buildGradeKbNode() {
  return async (state: AgentStateType) => {
    const grader = getLlm('openai/gpt-oss-20b').withStructuredOutput(
      EvidenceSchema,
      {
        method: 'jsonMode',
      },
    );

    const context = state.kb_docs
      .map(
        (doc) =>
          `Source: ${doc.metadata.source ?? 'unknown'}\nContent: ${doc.pageContent}`,
      )
      .join('\n\n');

    const grade = await grader.invoke(
      `You grade evidence for an enterprise IT support assistant.
Question: ${state['question']}
Private company KB evidence:\n${context}
Return good only if the evidence is sufficient to answer confidently and specifically.
Otherwise return weak. JSON: {{"grade":"good"}} or {{"grade":"weak"}}.`,
    );

    return {
      kb_grade: grade.grade,
      trace: routeAddTrace(state, `Grader: ${grade.grade.toUpperCase()}`),
    };
  };
}
