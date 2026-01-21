import { describe, it, expect, vi } from 'vitest';
import { env } from '../lib/env.js';

describe('Environment Variables', () => {
    it('should have required environment variables', () => {
        expect(env).toBeDefined();
    });

    it('should error if required environment variables are missing', async () => {
        // Import our new function and the schema
        const { validateEnv } = await import('../lib/env.js');
        const { z } = await import('zod');

        const testSchema = z.object({
            REQUIRED_VAR: z.string(),
        });

        // Mock process.exit and console.error
        const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
            throw new Error('process.exit');
        });
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        try {
            // Call validation with missing data
            validateEnv(testSchema as any, {});
        } catch (e: any) {
            expect(e.message).toBe('process.exit');
        }

        expect(exitSpy).toHaveBeenCalledWith(1);
        expect(errorSpy).toHaveBeenCalled();

        // Cleanup
        exitSpy.mockRestore();
        errorSpy.mockRestore();
    });

    it('should have the expected environment variables', () => {
        expect(env.NODE_ENV).toBe('test');
        expect(env.PORT).toBeDefined();
    });
})