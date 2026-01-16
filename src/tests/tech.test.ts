import { describe, it, expect, vi, beforeEach } from 'vitest';
import { techRoute } from '../routes/v1/tech.ts';

const mocks = vi.hoisted(() => {
    const mockReturning = vi.fn();
    const mockValues = vi.fn();
    const mockInsert = vi.fn();
    const mockWhere = vi.fn();
    const mockFrom = vi.fn();
    const mockSelect = vi.fn();
    const mockDelete = vi.fn();

    return {
        mockInsert,
        mockValues,
        mockReturning,
        mockSelect,
        mockFrom,
        mockWhere,
        mockDelete,
    };
});

vi.mock('../db/index.ts', () => ({
    db: {
        insert: mocks.mockInsert,
        select: mocks.mockSelect,
        delete: mocks.mockDelete,
    },
}));

describe('Tech Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default chaining
        mocks.mockInsert.mockReturnValue({ values: mocks.mockValues });
        mocks.mockValues.mockReturnValue({ returning: mocks.mockReturning });

        mocks.mockSelect.mockReturnValue({ from: mocks.mockFrom });
        // Default from returns an object with where.
        // Use 'as any' to avoid strict type checks if we override it later.
        mocks.mockFrom.mockReturnValue({ where: mocks.mockWhere });

        mocks.mockDelete.mockReturnValue({ where: mocks.mockWhere });
    });

    describe('POST /', () => {
        it('should create a new tech stack', async () => {
            const newTech = { name: 'React' };
            const createdTech = { id: 1, ...newTech };

            mocks.mockReturning.mockResolvedValue([createdTech]);

            const res = await techRoute.request('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTech),
            });

            expect(res.status).toBe(201);
            const body = await res.json();
            expect(body).toEqual({
                success: true,
                message: 'Tech stack created successfully',
                data: createdTech,
            });
            expect(mocks.mockInsert).toHaveBeenCalled();
        });

        it('should return 409 if tech stack already exists', async () => {
            const newTech = { name: 'React' };

            // Mock error with Postgres unique violation
            const pgError = new Error('duplicate key value violates unique constraint');
            (pgError as any).cause = { code: 23505 };

            mocks.mockReturning.mockRejectedValue(pgError);

            const res = await techRoute.request('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTech),
            });

            expect(res.status).toBe(409);
            const body = await res.json();
            expect(body).toEqual({
                success: false,
                message: 'Tech stack already exists',
            });
            expect(mocks.mockInsert).toHaveBeenCalled();
        });

        it('should return 500 if an error occurs', async () => {
            const newTech = { name: 'React' };

            // Mock console.error to suppress expected error logs
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            // Mock generic database error (not unique violation)
            const dbError = new Error('Connection timeout');
            (dbError as any).cause = { code: '08006' }; // Postgres connection failure code

            mocks.mockReturning.mockRejectedValue(dbError);

            const res = await techRoute.request('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTech),
            });

            // Just verify status code - global error handler is tested separately
            expect(res.status).toBe(500);
            expect(mocks.mockInsert).toHaveBeenCalled();

            // Verify error was logged
            expect(consoleErrorSpy).toHaveBeenCalled();

            // Restore console.error
            consoleErrorSpy.mockRestore();
        });
    });

    describe('GET /', () => {
        it('should return all tech stacks', async () => {
            const techList = [{ id: 1, name: 'React' }, { id: 2, name: 'Hono' }];
            // select().from() returns a promise directly in the code: await db.select().from(...)
            // But wait, in the code: const results = await db.select().from(techStack);
            // So mockFrom needs to return the promise or have a then/await interface?
            // Actually Drizzle query builders are thenable.
            // Let's adjust the mock.
            mocks.mockFrom.mockResolvedValue(techList);

            const res = await techRoute.request('/', {
                method: 'GET',
            });

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body).toEqual({
                success: true,
                message: 'Tech stacks fetched successfully',
                data: techList,
            });
        });
    });

    describe('GET /{id}', () => {
        it('should return a tech stack and 200 if found', async () => {
            const tech = { id: 1, name: 'React' };
            mocks.mockWhere.mockResolvedValue([tech]);

            const res = await techRoute.request('/1', { method: 'GET' });

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body).toEqual({
                success: true,
                message: 'Tech stack fetched successfully',
                data: tech,
            });
        });

        it('should return 404 if not found', async () => {
            mocks.mockWhere.mockResolvedValue([]);

            const res = await techRoute.request('/999', { method: 'GET' });

            expect(res.status).toBe(404);
            const body = await res.json();
            expect(body).toEqual({
                success: false,
                message: 'Tech stack not found',
            });
        });
    });

    describe('DELETE /{id}', () => {
        it('should delete a tech stack and return 200', async () => {
            // First it checks if it exists
            mocks.mockSelect.mockReturnValue({ from: () => ({ where: vi.fn().mockResolvedValue([{ id: 1 }]) }) });
            // Then it deletes
            mocks.mockWhere.mockResolvedValue([]); // delete returns nothing usually or result object, but code awaits it.

            // Wait, the code calls select first:
            // const result = await db.select().from(techStack).where(eq(techStack.id, id));
            // Then delete: await db.delete(techStack).where(eq(techStack.id, id));

            // We need to verify both calls.
            // Let's refine the mock structure for multiple calls.

            // Mock Select for check
            const mockWhereSelect = vi.fn().mockResolvedValue([{ id: 1 }]);
            mocks.mockSelect.mockReturnValue({ from: () => ({ where: mockWhereSelect }) });

            // Mock Delete
            const mockWhereDelete = vi.fn().mockResolvedValue([]);
            mocks.mockDelete.mockReturnValue({ where: mockWhereDelete });

            const res = await techRoute.request('/1', { method: 'DELETE' });

            expect(res.status).toBe(200);
            const body = await res.json();

            expect(body).toEqual({
                success: true,
                message: 'Tech stack deleted',
                data: {
                    id: 1
                }
            });
        });

        it('should return 404 if tech stack to delete is not found', async () => {
            const mockWhereSelect = vi.fn().mockResolvedValue([]);
            mocks.mockSelect.mockReturnValue({ from: () => ({ where: mockWhereSelect }) });

            const res = await techRoute.request('/999', { method: 'DELETE' });

            expect(res.status).toBe(404);
        });
    });
});
