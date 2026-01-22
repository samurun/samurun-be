import { createFactory } from 'hono/factory';
import type { Env } from '../types/hono.js';

export const factory = createFactory<Env>();
