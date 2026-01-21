import { z } from "zod";
import { extendZodWithOpenApi } from "@hono/zod-openapi";

extendZodWithOpenApi(z);

export const experienceSchema = z.object({
    logo: z.string(),
    company: z.string().min(1),
    position: z.string().min(1),
    type: z.string().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    description: z.string().min(1),
    skills: z.array(z.string()),
    isRemote: z.boolean().default(false),
})

export const experienceSchemaResponse = experienceSchema.extend({
    id: z.number().openapi({ example: 1 }),
})

export const experienceParamsSchema = z.object({
    id: z.coerce.number().openapi({
        param: {
            name: 'id',
            in: 'path',
        },
        example: 1,
    }),
})