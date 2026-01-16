import 'dotenv/config';
import { serve } from '@hono/node-server';
import { techRoute } from './routes/v1/tech.ts';;
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

const app = new OpenAPIHono();

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

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(
      `Swagger UI is available on http://localhost:${info.port}/swagger`
    );
  }
);
