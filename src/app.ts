import 'dotenv/config';
import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { errorHandler, notFoundHandler } from './middlewares/error.js';

import { techRoute } from './routes/v1/tech.js';;
import { summaryRoute } from './routes/v1/summary.js';
import { experienceRoute } from './routes/v1/experience.js';

const app = new OpenAPIHono();

app.onError(errorHandler);
app.notFound(notFoundHandler);

app.get('/health', (c) => {
  return c.json({
    name: 'samurun-api',
    status: 'ok',
  });
});

// OpenAPI JSON
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Samurun API',
    version: '1.0.0',
    description: 'Backend for portfolio & blog',
  },
});

// Swagger UI
app.get('/swagger', swaggerUI({ url: '/doc' }));

app.route('/api/v1/tech', techRoute);
app.route('/api/v1/summary', summaryRoute)
app.route('/api/v1/experience', experienceRoute)

serve(
  {
    fetch: app.fetch,
    port: Number(process.env.PORT || 3000),
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(
      `Swagger UI is available on http://localhost:${info.port}/swagger`
    );
  }
);
