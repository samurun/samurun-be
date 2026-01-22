import { eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { users } from '../../db/schema.js';

export const UserService = {
    async findByEmail(email: string) {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user || null;
    },

    async create(data: typeof users.$inferInsert) {
        const [newUser] = await db.insert(users).values(data).returning({
            id: users.id,
            name: users.name,
            email: users.email,
        });
        return newUser;
    },

    async findById(id: number) {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user || null;
    }
};
