import z from 'zod';

export const RouteSchema = z.object({
  route: z.enum(['kb', 'direct']).describe('Route decision for the question'),
});
