import z from 'zod';

export const EvidenceSchema = z.object({
  grade: z
    .enum(['good', 'weak'])
    .describe('Whether the evidence is sufficient to answer the question'),
});
