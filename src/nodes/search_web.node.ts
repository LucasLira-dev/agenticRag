import { AgentStateType } from 'src/state/state';
import { webSearch } from 'src/tools/web_search.tool';
import { routeAddTrace } from '../routers/add_trace.router';

export function buildSearchWebNode() {
  return async (state: AgentStateType) => {
    const result = await webSearch.invoke({
      query: state.current_query,
    });

    const lines: string[] = [],
      citations: { title: string; url: string; type: string }[] = [];

    if (result instanceof Object) {
      if ('answer' in result) {
        lines.push('Search answer: ' + result.answer);
      }
      for (const item of result['results']) {
        const { title, url, content } = item as {
          title: string;
          url: string;
          content: string;
        };
        lines.push(`Title: ${title}\nURL: ${url}\nContent: ${content}`);
        citations.push({ title: title || url, url, type: 'web' });
      }
    } else {
      lines.push(String(result));
    }

    return {
      web_results: '\n\n'.concat(lines.join('\n\n')),
      citations,
      source_used: 'web',
      ...routeAddTrace(state, `Web fallback → Tavily search`),
    };
  };
}
