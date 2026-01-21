export { techStack } from './schema.js';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema.js';

const client = new Client({
  database: String(process.env.POSTGRES_DB),
  user: String(process.env.POSTGRES_USER),
  password: String(process.env.POSTGRES_PASSWORD),
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
});

await client.connect();

export const db = drizzle(client, { schema });
