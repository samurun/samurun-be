import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ExperienceService } from './experience.service.js';
import { db } from '../../db/client.js';

vi.mock('../../db/client.js', () => ({
    db: {
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('ExperienceService Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('create: should handle Date instances for startDate and endDate', async () => {
        const data = {
            startDate: new Date('2020-01-01'),
            endDate: new Date('2020-12-31'),
            other: 'foo'
        };
        const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
        (db.insert as any).mockReturnValue({ values: vi.fn().mockReturnValue({ returning: mockReturning }) });

        await ExperienceService.create(data);

        expect(db.insert).toHaveBeenCalled();
        const callArgs = (db.insert as any).mock.calls[0][0]; // This doesn't catch the values() call easily
        // Instead check the values() call
        const valuesSpy = (db.insert as any)().values;
        expect(valuesSpy).toHaveBeenCalledWith({
            other: 'foo',
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
        });
    });

    it('update: should handle Date instances for startDate and endDate', async () => {
        const data = {
            startDate: new Date('2020-01-01'),
            endDate: new Date('2020-12-31'),
        };
        const mockReturning = vi.fn().mockResolvedValue([{ id: 1 }]);
        (db.update as any).mockReturnValue({
            set: vi.fn().mockReturnValue({
                where: vi.fn().mockReturnValue({ returning: mockReturning })
            })
        });

        await ExperienceService.update(1, data);

        const setSpy = (db.update as any)().set;
        expect(setSpy).toHaveBeenCalledWith({
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
        });
    });
});
