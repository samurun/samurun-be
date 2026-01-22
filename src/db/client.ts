export { techStack } from './schema.js';

import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as schema from './schema.js';

import { env } from '../utils/env.js';

const client = new Client({
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  host: env.POSTGRES_HOST,
  port: parseInt(env.POSTGRES_PORT),
});

await client.connect();

export const db = drizzle(client, { schema });
