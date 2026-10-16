import { Injectable } from '@nestjs/common';
import { END, START, StateGraph } from '@langchain/langgraph';
import { AgentState, AgentStateType } from 'src/state/state';
import { buildRouteQuestionNode } from 'src/nodes/route_question.node';
import { RouteAfterRouter } from 'src/routers/route_after.router';
import { buildRetrieveKbNode } from 'src/nodes/retrieve_kb.node';
import { buildGradeKbNode } from 'src/nodes/grade_kb.node';
import { buildSearchWebNode } from 'src/nodes/search_web.node';
import { buildRewriteQueryNode } from 'src/nodes/rewrite_query.node';
import { buildInsufficientNode } from 'src/nodes/insufficient.node';
import { buildGradeWebNode } from 'src/nodes/grade_web.node';
import { buildGenerateFromWebNode } from 'src/nodes/generate_from_web.node';
import { buildDirectAnswerNode } from 'src/nodes/direct_answer';
import { routeAfterKb } from 'src/routers/after_kb.router';
import { routeAfterWeb } from 'src/routers/after_web.router';
import { BuildGenerateFromKbNode } from 'src/nodes/generate_from_kb.node';

@Injectable()
export class AgentService {
  private app = this.compileGraph();

  private compileGraph() {
    const graph = new StateGraph(AgentState)
      .addNode('route_question', buildRouteQuestionNode())
      .addNode('retrieve_kb', buildRetrieveKbNode)
      .addNode('grade_kb', buildGradeKbNode())
      .addNode('search_web', buildSearchWebNode())
      .addNode('rewrite_query', buildRewriteQueryNode())
      .addNode('insufficient', buildInsufficientNode)
      .addNode('grade_web', buildGradeWebNode())
      .addNode('generate_from_web', buildGenerateFromWebNode())
      .addNode('generate_from_kb', BuildGenerateFromKbNode())
      .addNode('direct_answer', buildDirectAnswerNode());

    graph.addEdge(START, 'route_question');
    graph.addConditionalEdges('route_question', RouteAfterRouter, {
      retrieve_kb: 'retrieve_kb',
      direct_answer: 'direct_answer',
    });
    graph.addEdge('retrieve_kb', 'grade_kb');
    graph.addConditionalEdges('grade_kb', routeAfterKb, {
      generate_from_kb: 'generate_from_kb',
      search_web: 'search_web',
    });
    graph.addEdge('search_web', 'grade_web');
    graph.addConditionalEdges('grade_web', routeAfterWeb, {
      generate_from_web: 'generate_from_web',
      rewrite_query: 'rewrite_query',
      insufficient: 'insufficient',
    });
    graph.addEdge('rewrite_query', 'search_web');
    graph.addEdge('generate_from_kb', END);
    graph.addEdge('generate_from_web', END);
    graph.addEdge('direct_answer', END);
    graph.addEdge('insufficient', END);

    return graph.compile();
  }

  async ask(question: string) {
    const initial: AgentStateType = {
      question: question,
      current_query: question,
      kb_docs: [],
      web_results: '',
      kb_grade: '',
      web_grade: '',
      answer: '',
      source_used: '',
      retry_count: 0,
      trace: [],
      citations: [],
    };

    return this.app.invoke(initial);
  }
}
