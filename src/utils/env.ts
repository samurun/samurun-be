import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('3000'),
    DATABASE_URL: z.string(),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    POSTGRES_DB: z.string(),
    POSTGRES_USER: z.string(),
    POSTGRES_PASSWORD: z.string(),
    POSTGRES_HOST: z.string(),
    POSTGRES_PORT: z.string().default('5432'),
    JWT_SECRET: z.string(),
});

export const validateEnv = (schema: typeof envSchema, data: any) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        console.error('❌ Invalid environment variables:', result.error.format());
        process.exit(1);
    }
    return result.data;
};

export const env = validateEnv(envSchema, process.env);
