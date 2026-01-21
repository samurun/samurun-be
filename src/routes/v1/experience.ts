import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm'

import { createResponseSchema, errorResponse, errorResponseSchema, successResponse } from '../../lib/api.js';
import { db } from '../../db/index.js';
import { experience } from '../../db/schema.js'
import { experienceParamsSchema, experienceSchema, experienceSchemaResponse } from '../../validators/experience.schema.js';


export const experienceRoute = new OpenAPIHono()

const createExperienceRoute = createRoute({
    tags: ['Experience'],
    method: 'post',
    path: '/',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: experienceSchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Experience created successfully',
            content: {
                'application/json': {
                    schema: createResponseSchema(experienceSchemaResponse),
                },
            },
        },
    }
})

experienceRoute.openapi(createExperienceRoute, async (c) => {
    const body = c.req.valid('json')

    const [result] = await db.insert(experience).values({
        ...body,
        startDate: body.startDate.toISOString(),
        endDate: body.endDate.toISOString(),
    }).returning()

    return c.json(successResponse(result, 'Experience created successfully'), 201)
})

const getAllExperienceRoute = createRoute({
    tags: ['Experience'],
    method: 'get',
    path: '/',
    responses: {
        200: {
            description: 'Experiences fetched successfully',
            content: {
                'application/json': {
                    schema: createResponseSchema(z.array(experienceSchemaResponse)),
                },
            },
        },
    }
})

experienceRoute.openapi(getAllExperienceRoute, async (c) => {
    const result = await db.select().from(experience)
    return c.json(successResponse(result, 'Experiences fetched successfully'), 200)
})

const getExperienceByIdRoute = createRoute({
    tags: ['Experience'],
    method: 'get',
    path: '/{id}',
    request: {
        params: experienceParamsSchema,
    },
    responses: {
        200: {
            description: 'Experience fetched successfully',
            content: {
                'application/json': {
                    schema: createResponseSchema(experienceSchemaResponse),
                },
            },
        },
        404: {
            description: 'Experience not found',
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    }
})

experienceRoute.openapi(getExperienceByIdRoute, async (c) => {
    const id = c.req.param('id')
    const result = await db.select().from(experience).where(eq(experience.id, Number(id)))

    if (result.length === 0) {
        return c.json(errorResponse('Experience not found'), 404)
    }
    return c.json(successResponse(result[0], 'Experience fetched successfully'), 200)
})

const updateExperienceRoute = createRoute({
    tags: ['Experience'],
    method: 'put',
    path: '/{id}',
    request: {
        params: experienceParamsSchema,
        body: {
            content: {
                'application/json': {
                    schema: experienceSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Experience updated successfully',
            content: {
                'application/json': {
                    schema: createResponseSchema(experienceSchemaResponse),
                },
            },
        },
        404: {
            description: 'Experience not found',
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    }
})

experienceRoute.openapi(updateExperienceRoute, async (c) => {
    const id = c.req.param('id')
    const body = c.req.valid('json')

    const result = await db.update(experience).set({
        ...body,
        startDate: body.startDate.toISOString(),
        endDate: body.endDate.toISOString(),
    }).where(eq(experience.id, Number(id))).returning()

    if (result.length === 0) {
        return c.json(errorResponse('Experience not found'), 404)
    }
    return c.json(successResponse(result[0], 'Experience updated successfully'), 200)
})

const deleteExperienceRoute = createRoute({
    tags: ['Experience'],
    method: 'delete',
    path: '/{id}',
    request: {
        params: experienceParamsSchema,
    },
    responses: {
        200: {
            description: 'Experience deleted successfully',
            content: {
                'application/json': {
                    schema: createResponseSchema(z.unknown()),
                },
            },
        },
        404: {
            description: 'Experience not found',
            content: {
                'application/json': {
                    schema: errorResponseSchema,
                },
            },
        },
    }
})

experienceRoute.openapi(deleteExperienceRoute, async (c) => {
    const id = c.req.param('id')
    const result = await db.delete(experience).where(eq(experience.id, Number(id)))

    if (result.rowCount === 0) {
        return c.json(errorResponse('Experience not found'), 404)
    }
    return c.json(successResponse(result, 'Experience deleted successfully'), 200)
})
