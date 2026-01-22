import { z } from 'zod';
import { extendZodWithOpenApi } from '@hono/zod-openapi';

extendZodWithOpenApi(z);

export const techSchema = z.object({
  name: z.string().min(1).openapi({
    example: 'React',
  }),
});

export const techResponseSchema = techSchema.extend({
  id: z.number().openapi({ example: 1 }),
});

export const techParamSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: 'id',
      in: 'path',
    },
    example: 1,
  }),
});
