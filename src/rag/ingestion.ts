import { extname } from 'node:path';
import { readFile } from 'node:fs/promises';

import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PDFParse } from 'pdf-parse';
import { readFileSync } from 'node:fs';
import mammoth from 'mammoth';
import { addDocuments, resetCollection } from './vectorstore';
import fs from 'fs';

const SUPPORTED_FILE_TYPES = ['.pdf', '.txt', '.md', '.docx'];

async function loadPdfPages(filePath: string): Promise<Document[]> {
  const parser = new PDFParse({
    data: new Uint8Array(readFileSync(filePath)),
  });
  try {
    const { pages } = await parser.getText();
    return pages.map(
      (page) =>
        new Document({
          pageContent: page.text,
          metadata: { source: filePath, page: page.num - 1 },
        }),
    );
  } finally {
    await parser.destroy();
  }
}

export async function loadFile(filePath: string): Promise<Document[]> {
  const suffix = extname(filePath).toLocaleLowerCase();

  if (!SUPPORTED_FILE_TYPES.includes(suffix)) {
    throw new Error(`Unsupported file type: ${suffix}`);
  }

  if (suffix === '.pdf') {
    return loadPdfPages(filePath);
  }

  if (suffix === '.txt' || suffix === '.md') {
    const text = await readFile(filePath, 'utf-8');

    return [
      new Document({
        pageContent: text,
        metadata: { source: filePath },
      }),
    ];
  }

  if (suffix === '.docx') {
    const buffer = await readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });

    return [
      new Document({
        pageContent: result.value,
        metadata: { source: filePath },
      }),
    ];
  }

  throw new Error(`Unsupported file type: ${suffix}`);
}

export async function chunkDocuments(docs: Document[]): Promise<Document[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 900,
    chunkOverlap: 120,
  });

  return splitter.splitDocuments(docs);
}

const SAMPLE_KB_PATH = process.env.SAMPLE_KB_PATH || 'src/data/sample_kb';

async function main() {
  try {
    const files = fs.readdirSync(SAMPLE_KB_PATH);

    await resetCollection();
    console.log(`Collection reset. Ingesting ${files.length} file(s)...`);

    for (const file of files) {
      const filePath = `${SAMPLE_KB_PATH}/${file}`;
      const docs = await loadFile(filePath);
      const chunks = await chunkDocuments(docs);
      await addDocuments(chunks);
      console.log(`Added ${chunks.length} chunk(s) from ${filePath}`);
    }

    console.log('Ingestion complete.');
    process.exit(0);
  } catch (error) {
    console.error('Ingestion failed:', error);
    process.exit(1);
  }
}

void main();
