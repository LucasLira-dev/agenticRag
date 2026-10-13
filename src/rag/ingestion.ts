import { extname } from 'node:path';
import { readFile } from 'node:fs/promises';

import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { PDFParse } from 'pdf-parse';
import { readFileSync } from 'node:fs';
import mammoth from 'mammoth';
import { addDocuments } from './vectorstore';

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

async function main() {
  const docs = await loadFile('src/data/sample_kb/company_it_handbook.md');

  const chunks = await chunkDocuments(docs);

  const response = await addDocuments(chunks);
  console.log('Documents added to vector store:', response);
}

main().catch(console.error);
