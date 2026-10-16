import { Annotation } from '@langchain/langgraph';
import { Document } from '@langchain/core/documents';

export interface RouteDecision {
  route: 'kb' | 'direct'; // kb for IT/support questions; direct for greetings/simple chat
}

export interface EvidenceGrade {
  grade: 'good' | 'weak'; // Whether evidence is sufficient to answer
}

export const AgentState = Annotation.Root({
  question: Annotation<string>,
  current_query: Annotation<string>,
  kb_docs: Annotation<Document[]>,
  web_results: Annotation<string>,
  kb_grade: Annotation<string>,
  web_grade: Annotation<string>,
  answer: Annotation<string>,
  source_used: Annotation<string>,
  retry_count: Annotation<number>,
  trace: Annotation<string[]>,
  citations: Annotation<object[]>,
});

export type AgentStateType = typeof AgentState.State;
