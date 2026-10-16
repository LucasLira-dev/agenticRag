import { tool } from 'langchain';
import { TavilySearch } from '@langchain/tavily';
import { z } from 'zod';
import 'dotenv/config';

if (!process.env.TAVILY_API_KEY) {
  throw new Error('Missing required environment variable: TAVILY_API_KEY');
}

export const webSearch = tool(
  async ({ query, maxResults = 5, topic = 'general' }) => {
    const tavilySearch = new TavilySearch({
      maxResults,
      tavilyApiKey: process.env.TAVILY_API_KEY,
      topic,
      includeAnswer: true,
      includeRawContent: false,
    });
    return await tavilySearch._call({ query });
  },
  {
    name: 'internet_search',
    description: 'Run a web search',
    schema: z.object({
      query: z.string().describe('The search query'),
      maxResults: z.number().optional().default(5),
      topic: z
        .enum(['general', 'news', 'finance'])
        .optional()
        .default('general'),
    }),
  },
);

export const webSearchTool = {
  name: 'internet_search',
  description: 'Run a web search',
  func: webSearch,
};
