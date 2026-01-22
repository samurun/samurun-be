import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { techStack } from '../../db/schema.js';

export const TechService = {
    async getAll() {
        return await db.select().from(techStack);
    },

    async getById(id: number) {
        const [result] = await db.select().from(techStack).where(eq(techStack.id, id));
        return result || null;
    },

    async create(data: { name: string }) {
        const [result] = await db.insert(techStack).values(data).returning();
        return result;
    },

    async delete(id: number) {
        const [result] = await db.select().from(techStack).where(eq(techStack.id, id));
        if (!result) return null;
        await db.delete(techStack).where(eq(techStack.id, id));
        return result;
    }
};
