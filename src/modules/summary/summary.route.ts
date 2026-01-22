import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';

import { summaryParamsSchema, summarySchema, summarySchemaResponse } from './summary.validator.js';
import { createResponseSchema, successResponse } from '../../utils/api.js';
import { factory } from '../../utils/factory.js';
import type { Env } from '../../types/hono.js';
import { SummaryService } from './summary.service.js';

export const summaryRoute = new OpenAPIHono<Env>()

const createSummaryRoute = createRoute({
    tags: ['Summary'],
    method: 'post',
    path: '/',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: summarySchema,
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Summary created successfully',
            content: {
                'application/json': {
                    schema: createResponseSchema(summarySchemaResponse),
                },
            },
        },
    }

})

summaryRoute.openapi(createSummaryRoute, async (c) => {
    const body = c.req.valid('json')

    const result = await SummaryService.create(body)

    return c.json(successResponse(result, 'Summary created successfully'), 201)
})

const getAllSummaryRoute = createRoute({
    tags: ['Summary'],
    method: 'get',
    path: '/',
    responses: {
        200: {
            description: 'Summaries fetched successfully',
            content: {
                'application/json': {
                    schema: createResponseSchema(z.array(summarySchemaResponse)),
                },
            },
        },
    }
})

summaryRoute.openapi(getAllSummaryRoute, async (c) => {
    const result = await SummaryService.getAll()
    return c.json(successResponse(result, 'Summaries fetched successfully'), 200)
})

const updateSummaryRoute = createRoute({
    tags: ['Summary'],
    method: 'put',
    path: '/{id}',
    request: {
        params: summaryParamsSchema,
        body: {
            content: {
                'application/json': {
                    schema: summarySchema,
                },
            },
        },

    },
    responses: {
        200: {
            description: 'Summary updated successfully',
            content: {
                'application/json': {
                    schema: createResponseSchema(summarySchemaResponse),
                },
            },
        },
    }
})

summaryRoute.openapi(updateSummaryRoute, async (c) => {
    const { id } = c.req.valid('param')
    const body = c.req.valid('json')

    const result = await SummaryService.update(id, body)

    return c.json(successResponse(result, 'Summary updated successfully'), 200)
})
