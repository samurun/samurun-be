import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { experience } from '../../db/schema.js';

export const ExperienceService = {
    async getAll() {
        return await db.select().from(experience);
    },

    async getById(id: number) {
        const [result] = await db.select().from(experience).where(eq(experience.id, id));
        return result || null;
    },

    async create(data: any) {
        const [result] = await db.insert(experience).values({
            ...data,
            startDate: data.startDate instanceof Date ? data.startDate.toISOString() : data.startDate,
            endDate: data.endDate instanceof Date ? data.endDate.toISOString() : data.endDate,
        }).returning();
        return result;
    },

    async update(id: number, data: any) {
        const [result] = await db.update(experience).set({
            ...data,
            startDate: data.startDate instanceof Date ? data.startDate.toISOString() : data.startDate,
            endDate: data.endDate instanceof Date ? data.endDate.toISOString() : data.endDate,
        }).where(eq(experience.id, id)).returning();
        return result || null;
    },

    async delete(id: number) {
        const result = await db.delete(experience).where(eq(experience.id, id));
        return result.rowCount ?? 0;
    }
};
