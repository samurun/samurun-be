import { pgTable, text, serial } from 'drizzle-orm/pg-core';

export const techStack = pgTable('tech_stack', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});
