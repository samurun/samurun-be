import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { sign } from 'hono/jwt';

import { env } from '../../utils/env.js';
import { hashPassword, comparePassword } from '../../utils/auth-utils.js';
import { successResponse, errorResponse } from '../../utils/api.js';
import { loginSchema, signupSchema } from './auth.validator.js';
import { UserService } from '../user/user.service.js';
import type { Env } from '../../types/hono.js';

const authRoute = new OpenAPIHono<Env>();

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

        const existingUser = await UserService.findByEmail(email);
        if (existingUser) {
            return c.json(errorResponse('Email already in use'), 409);
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await UserService.create({
            name,
            email,
            password: hashedPassword,
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

        const user = await UserService.findByEmail(email);

        if (!user || !(await comparePassword(password, user.password))) {
            return c.json(errorResponse('Invalid credentials'), 401);
        }

        const token = await sign({ id: user.id, email: user.email }, env.JWT_SECRET);

        return c.json(successResponse({ token }, 'Login successful'));
    }
);

export { authRoute };
