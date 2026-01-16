import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';

import { createResponseSchema, errorResponseSchema, successResponse, errorResponse } from '../../lib/api.ts';
import { db } from '../../db/index.ts';
import { techStack } from '../../db/schema.ts';
import {
  techSchema,
  techResponseSchema,
  techParamSchema,
} from '../../validators/tech.schema.ts';

export const techRoute = new OpenAPIHono();

const createTechRoute = createRoute({
  tags: ['Tech stack'],
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
          schema: createResponseSchema(techResponseSchema),
        },
      },
    },
    409: {
      description: 'Tech stack already exists',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

techRoute.openapi(createTechRoute, async (c) => {
  const body = c.req.valid('json');

  try {
    const [result] = await db.insert(techStack).values(body).returning();
    return c.json(
      successResponse(result, 'Tech stack created successfully'),
      201
    );
  } catch (error: any) {
    if (error.cause.code === 23505) {
      return c.json(errorResponse('Tech stack already exists'), 409);
    }
    throw error;
  }
});

const getAllTechRoute = createRoute({
  tags: ['Tech stack'],
  method: 'get',
  path: '/',
  responses: {
    200: {
      description: 'Get all tech stacks',
      content: {
        'application/json': {
          schema: createResponseSchema(z.array(techResponseSchema)),
        },
      },
    },
  },
});

techRoute.openapi(getAllTechRoute, async (c) => {
  const results = await db.select().from(techStack);

  return c.json(
    successResponse(results, 'Tech stacks fetched successfully'),
    200
  );
});

const getTechByIDRoute = createRoute({
  tags: ['Tech stack'],
  method: 'get',
  path: '/{id}',
  request: {
    params: techParamSchema,
  },
  responses: {
    200: {
      description: 'Get tech stack by id',
      content: {
        'application/json': {
          schema: createResponseSchema(techResponseSchema),
        },
      },
    },
    404: {
      description: 'Tech stack not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});


techRoute.openapi(getTechByIDRoute, async (c) => {
  const { id } = c.req.valid('param');
  const result = await db.select().from(techStack).where(eq(techStack.id, id));

  if (result.length === 0) {
    return c.json(
      errorResponse('Tech stack not found'),
      404
    );
  }

  return c.json(
    successResponse(result[0], 'Tech stack fetched successfully'),
    200
  );
});


const deleteTechRoute = createRoute({
  tags: ['Tech stack'],
  method: 'delete',
  path: '/{id}',
  request: {
    params: techParamSchema,
  },
  responses: {
    200: {
      description: 'Delete tech stack by id',
      content: {
        'application/json': {
          schema: createResponseSchema(z.unknown()),
        },
      },
    },
    404: {
      description: 'Tech stack not found',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
})

techRoute.openapi(deleteTechRoute, async (c) => {
  const { id } = c.req.valid('param');
  const result = await db.select().from(techStack).where(eq(techStack.id, id));

  if (result.length === 0) {
    return c.json(
      errorResponse('Tech stack not found'),
      404
    );
  }

  await db.delete(techStack).where(eq(techStack.id, id));
  return c.json(
    successResponse(result[0], 'Tech stack deleted'),
    200
  );
});