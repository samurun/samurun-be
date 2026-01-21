import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authRoute } from '../routes/v1/auth.js';
import { db } from '../db/index.js';

vi.mock('../db/index.js', () => ({
    db: {
        insert: vi.fn(),
        select: vi.fn(),
    },
}));

vi.mock('../lib/auth-utils.js', () => ({
    hashPassword: vi.fn().mockResolvedValue('hashed_password'),
    comparePassword: vi.fn().mockResolvedValue(true),
}));

describe('Auth Routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('POST /signup', () => {
        it('should create a new user', async () => {
            const newUser = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            // Mock select to find no existing user
            (db.select as any).mockReturnValue({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([])
                })
            });

            const mockReturning = vi.fn().mockResolvedValue([{ id: 1, name: 'John Doe', email: 'john@example.com' }]);
            (db.insert as any).mockReturnValue({ values: vi.fn().mockReturnValue({ returning: mockReturning }) });

            const res = await authRoute.request('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            expect(res.status).toBe(201);
            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.data.id).toBe(1);
        });


        it('should be 409 if email is already in use', async () => {
            const newUser = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            // Mock select to find an existing user
            (db.select as any).mockReturnValue({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([{ id: 1, email: 'john@example.com' }])
                })
            });

            const res = await authRoute.request('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser),
            });

            expect(res.status).toBe(409);
            const body = await res.json();
            expect(body.success).toBe(false);
            expect(body.message).toBe('Email already in use');
        });
    });

    describe('POST /login', () => {
        it('should return 200 if valid credentials', async () => {
            const user = {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashed_password',
            };

            (db.select as any).mockReturnValue({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([user])
                })
            });


            const res = await authRoute.request('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    password: 'password123'
                }),
            });

            expect(res.status).toBe(200);
            const body = await res.json();
            expect(body.success).toBe(true);
            expect(body.data.token).toBeDefined();
        });

        it('should return 401 if invalid credentials', async () => {
            const user = {
                email: 'john@example.com',
                password: 'password123',
            };

            const mockReturning = vi.fn().mockResolvedValue([]);
            (db.select as any).mockReturnValue({ from: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue([]) }) });

            const res = await authRoute.request('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            expect(res.status).toBe(401);
            const body = await res.json();
            expect(body.success).toBe(false);
            expect(body.message).toBe('Invalid credentials');
        });
    });
});
