import { QdrantClient } from '@qdrant/js-client-rest';
import { QdrantVectorStore } from '@langchain/qdrant';
import 'dotenv/config';

import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Document } from '@langchain/core/documents';

if (
  !process.env.QDRANT_API_KEY ||
  !process.env.QDRANT_URL ||
  !process.env.GOOGLE_API_KEY
) {
  throw new Error('Missing required environment variables');
}

let vectorStore: QdrantVectorStore | null = null;

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: 'gemini-embedding-001',
});

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const vectorSize = 3072;

async function ensureCollection(): Promise<void> {
  const collections = await client.getCollections();

  const collectionName = process.env.QDRANT_COLLECTION_NAME || 'agentic-rag';
  const collectionExists = collections.collections.some(
    (collection) => collection.name === collectionName,
  );

  if (!collectionExists) {
    await client.createCollection(collectionName, {
      vectors: {
        size: vectorSize,
        distance: 'Cosine',
      },
    });

    return;
  }

  const info = await client.getCollection(collectionName);
  const vectors = info.config.params.vectors;

  if (!('size' in vectors!) || vectors.size !== vectorSize) {
    throw new Error(
      `Collection ${collectionName} has a different vector size than expected.`,
    );
  }
}

export async function getVectorStore(): Promise<QdrantVectorStore> {
  if (vectorStore) return vectorStore;

  await ensureCollection();

  vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
    collectionName: process.env.QDRANT_COLLECTION_NAME || 'agentic-rag',
    client,
  });

  return vectorStore;
}

export async function getRetriever() {
  const vectorStore = await getVectorStore();
  return vectorStore.asRetriever({
    k: 3,
  });
}

export async function addDocuments(chunks: Document[]): Promise<void> {
  const vectorStore = await getVectorStore();
  return vectorStore.addDocuments(chunks);
}
