import { z } from "zod";
import { extendZodWithOpenApi } from "@hono/zod-openapi";

extendZodWithOpenApi(z);

export const summarySchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
});


export const summarySchemaResponse = summarySchema.extend({
    id: z.number().openapi({ example: 1 }),
})

export const summaryParamsSchema = z.object({
    id: z.coerce.number().openapi({
        param: {
            name: 'id',
            in: 'path',
        },
        example: 1,
    }),
})