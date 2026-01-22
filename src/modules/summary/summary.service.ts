import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { summary } from '../../db/schema.js';

export const SummaryService = {
    async getAll() {
        return await db.select().from(summary);
    },

    async create(data: { title: string; description: string }) {
        const [result] = await db.insert(summary).values(data).returning();
        return result;
    },

    async update(id: number, data: { title: string; description: string }) {
        const [result] = await db.update(summary).set(data).where(eq(summary.id, id)).returning();
        return result || null;
    }
};
