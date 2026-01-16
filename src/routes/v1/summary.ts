import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm'

import { summaryParamsSchema, summarySchema, summarySchemaResponse } from '../../validators/sammary.schema.ts';
import { db } from '../../db/index.ts';
import { summary } from '../../db/schema.ts';
import { createResponseSchema } from '../../lib/api.ts';

export const summaryRoute = new OpenAPIHono()


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

    const [result] = await db.insert(summary).values(body).returning()

    return c.json({
        success: true,
        message: 'Summary created successfully',
        data: result,
    }, 201)
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
    const result = await db.select().from(summary)
    return c.json({
        success: true,
        message: 'Summaries fetched successfully',
        data: result,
    })
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
    const body = c.req.valid('json')
    const id = c.req.param('id')

    const [result] = await db.update(summary).set(body).where(eq(summary.id, Number(id))).returning()

    return c.json({
        success: true,
        message: 'Summary updated successfully',
        data: result,
    })
})
