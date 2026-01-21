import { z } from 'zod'

export const loginSchema = z.object({
    email: z.email().openapi({ example: 'john@example.com' }),
    password: z.string().openapi({ example: 'password123' }),
});

export const signupSchema = z.object({
    name: z.string().openapi({ example: 'John Doe' }),
    email: z.email().openapi({ example: 'john@example.com' }),
    password: z.string().min(6).openapi({ example: 'password123' }),
});