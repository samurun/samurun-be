import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';

import { errorHandler, notFoundHandler } from './middlewares/error.js';
import { env } from './lib/env.js';
import { configureOpenAPI } from './lib/configure-openapi.js';

import v1Router from './routes/v1/index.js';
import { authMiddleware } from './middlewares/auth.js';
import { customLoggerMiddleware } from './middlewares/logger.js';

const app = new OpenAPIHono();

// -- Middlewares
app.use('*', customLoggerMiddleware);
app.use('*', cors());

app.use('/api/v1/*', (c, next) => {
  if (c.req.method === 'GET' || c.req.path.startsWith('/api/v1/auth')) {
    return next();
  }
  return authMiddleware(c, next);
});

// -- Error Handling
app.onError(errorHandler);
app.notFound(notFoundHandler);

// -- Health Check
app.get('/health', (c) => {
  return c.json({
    name: 'samurun-api',
    status: 'ok',
  });
});

// -- OpenAPI & Swagger
configureOpenAPI(app);

// -- Routes
app.route('/api/v1', v1Router);

// -- Server
serve(
  {
    fetch: app.fetch,
    port: Number(env.PORT),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(
      `Swagger UI is available on http://localhost:${info.port}/swagger`
    );
  }
);
