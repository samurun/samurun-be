import { z } from 'zod';

export type ApiResponse<T = void> = {
    success: boolean;
    message: string;
    data?: T;
};

export const createResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.boolean().openapi({ example: true }),
        message: z.string().openapi({ example: 'Success' }),
        data: dataSchema.optional(),
    });

export const errorResponseSchema = z.object({
    success: z.boolean().openapi({ example: false }),
    message: z.string().openapi({ example: 'Error message' }),
});
