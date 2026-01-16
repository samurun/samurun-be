import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { db } from '../../db/index.ts';
import { techStack } from '../../db/schema.ts';
import {
  techSchema,
  techResponseSchema,
} from '../../validators/tech.schema.ts';

export const techRoute = new OpenAPIHono();

const createTechRoute = createRoute({
  method: 'post',
  path: '/',
  request: {
    body: {
      content: {
        'application/json': {
          schema: techSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Create tech stack',
      content: {
        'application/json': {
          schema: techResponseSchema,
        },
      },
    },
  },
});

techRoute.openapi(createTechRoute, async (c) => {
  const body = c.req.valid('json');

  const [result] = await db.insert(techStack).values(body).returning();

  return c.json(result, 201);
});

const getTechRoute = createRoute({
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Get all tech stacks',
    },
  },
});

techRoute.openapi(getTechRoute, async (c) => {
  const results = await db.select().from(techStack);
  // Ensure level is properly typed
  const typedResults = results.map((item) => ({
    ...item,
  }));
  return c.json(typedResults, 200);
});
