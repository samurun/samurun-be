import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/api.js';

export const errorHandler = async (err: Error, c: Context) => {
    if (err instanceof HTTPException) {
        return c.json(errorResponse(err.message), err.status);
    }

    if (err instanceof ZodError) {
        return c.json(errorResponse('Validation Error', err.flatten()), 400);
    }

    console.error(err);
    return c.json(errorResponse('Internal Server Error'), 500);
};

export const notFoundHandler = (c: Context) => {
    return c.json(errorResponse('Not Found'), 404);
};
