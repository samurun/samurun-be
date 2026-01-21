import { pgTable, text, serial, boolean } from 'drizzle-orm/pg-core';

export const techStack = pgTable('tech_stack', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});


export const summary = pgTable('summary', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
});

export const experience = pgTable('experience', {
  id: serial('id').primaryKey(),
  logo: text('logo').notNull().default('/placeholder.png'),
  company: text('company').notNull(),
  position: text('position').notNull(),
  type: text('type').notNull(),
  startDate: text('startDate').notNull(),
  endDate: text('endDate').notNull(),
  description: text('description').notNull(),
  skills: text('skills').array().notNull().default([]),
  isRemote: boolean('isRemote').notNull().default(false),
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});