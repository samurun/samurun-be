import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';

import { env } from '../../lib/env.js';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { hashPassword, comparePassword } from '../../lib/auth-utils.js';
import { successResponse, errorResponse } from '../../lib/api.js';
import { loginSchema, signupSchema } from '../../validators/auth.schema.js';

const authRoute = new OpenAPIHono();





authRoute.openapi(
    createRoute({
        tags: ['Auth'],
        method: 'post',
        path: '/signup',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: signupSchema,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'User created successfully',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: z.boolean(),
                            message: z.string(),
                            data: z.object({ id: z.number(), name: z.string(), email: z.string() }),
                        }),
                    },
                },
            },
            409: {
                description: 'Email already in use',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: z.boolean(),
                            message: z.string(),
                            data: z.null().optional(),
                        }),
                    },
                },
            },
        },
    }),
    async (c) => {
        const { name, email, password } = c.req.valid('json');

        const [existingUser] = await db.select().from(users).where(eq(users.email, email));
        if (existingUser) {
            return c.json(errorResponse('Email already in use'), 409);
        }

        const hashedPassword = await hashPassword(password);

        const [newUser] = await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        }).returning({
            id: users.id,
            name: users.name,
            email: users.email,
        });

        return c.json(successResponse(newUser, 'User created successfully') as any, 201);
    }
);

authRoute.openapi(
    createRoute({
        tags: ['Auth'],
        method: 'post',
        path: '/login',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: loginSchema,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Login successful',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: z.boolean(),
                            message: z.string(),
                            data: z.object({ token: z.string() }),
                        }),
                    },
                },
            },
            401: {
                description: 'Invalid credentials',
            },
        },
    }),
    async (c) => {
        const { email, password } = c.req.valid('json');

        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user || !(await comparePassword(password, user.password))) {
            return c.json(errorResponse('Invalid credentials'), 401);
        }

        const token = await sign({ id: user.id, email: user.email }, env.JWT_SECRET);

        return c.json(successResponse({ token }, 'Login successful'));
    }
);

export { authRoute };
