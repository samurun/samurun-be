import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { createResponseSchema, errorResponse, errorResponseSchema, successResponse } from '../../utils/api.js';
import { experienceParamsSchema, experienceSchema, experienceSchemaResponse } from './experience.validator.js';
import { ExperienceService } from './experience.service.js';
import type { Env } from '../../types/hono.js';

export const experienceRoute = new OpenAPIHono<Env>()

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
    const result = await ExperienceService.create(body)

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
    const result = await ExperienceService.getAll()
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
    const { id } = c.req.valid('param')
    const result = await ExperienceService.getById(id)

    if (!result) {
        return c.json(errorResponse('Experience not found'), 404)
    }
    return c.json(successResponse(result, 'Experience fetched successfully'), 200)
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
    const { id } = c.req.valid('param')
    const body = c.req.valid('json')

    const result = await ExperienceService.update(id, body)

    if (!result) {
        return c.json(errorResponse('Experience not found'), 404)
    }
    return c.json(successResponse(result, 'Experience updated successfully'), 200)
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
    const { id } = c.req.valid('param')
    const rowCount = await ExperienceService.delete(id)

    if (rowCount === 0) {
        return c.json(errorResponse('Experience not found'), 404)
    }
    return c.json(successResponse({ rowCount }, 'Experience deleted successfully'), 200)
})
