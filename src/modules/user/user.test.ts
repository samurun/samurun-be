import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user.service.js';
import { db } from '../../db/client.js';

vi.mock('../../db/client.js', () => ({
    db: {
        select: vi.fn(),
        insert: vi.fn(),
    },
}));

describe('UserService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('findByEmail', () => {
        it('should return a user if email exists', async () => {
            const user = { id: 1, name: 'John', email: 'john@example.com' };
            (db.select as any).mockReturnValue({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([user]),
                }),
            });

            const result = await UserService.findByEmail('john@example.com');
            expect(result).toEqual(user);
        });

        it('should return null if email does not exist', async () => {
            (db.select as any).mockReturnValue({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([]),
                }),
            });

            const result = await UserService.findByEmail('none@example.com');
            expect(result).toBeNull();
        });
    });

    describe('create', () => {
        it('should create and return a new user', async () => {
            const newUser = { name: 'New User', email: 'new@example.com', password: 'hash' };
            const returnedUser = { id: 1, name: 'New User', email: 'new@example.com' };

            (db.insert as any).mockReturnValue({
                values: vi.fn().mockReturnValue({
                    returning: vi.fn().mockResolvedValue([returnedUser]),
                }),
            });

            const result = await UserService.create(newUser);
            expect(result).toEqual(returnedUser);
        });
    });

    describe('findById', () => {
        it('should return a user if id exists', async () => {
            const user = { id: 1, name: 'John', email: 'john@example.com' };
            (db.select as any).mockReturnValue({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([user]),
                }),
            });

            const result = await UserService.findById(1);
            expect(result).toEqual(user);
        });

        it('should return null if id does not exist', async () => {
            (db.select as any).mockReturnValue({
                from: vi.fn().mockReturnValue({
                    where: vi.fn().mockResolvedValue([]),
                }),
            });

            const result = await UserService.findById(999);
            expect(result).toBeNull();
        });
    });
});
