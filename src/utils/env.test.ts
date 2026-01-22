import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import { validateEnv } from './env.js';

describe('env utils', () => {
    describe('validateEnv', () => {
        it('should return data if validation succeeds', () => {
            const schema = z.object({ FOO: z.string() });
            const data = { FOO: 'bar' };
            const result = validateEnv(schema as any, data);
            expect(result).toEqual(data);
        });

        it('should exit process and log error if validation fails', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
            const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => ({} as never));
            const schema = z.object({ FOO: z.string() });
            const data = {};

            validateEnv(schema as any, data);

            expect(consoleSpy).toHaveBeenCalled();
            expect(exitSpy).toHaveBeenCalledWith(1);

            consoleSpy.mockRestore();
            exitSpy.mockRestore();
        });
    });
});
