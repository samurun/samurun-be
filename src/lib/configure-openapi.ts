import { swaggerUI } from '@hono/swagger-ui';
import type { OpenAPIHono } from '@hono/zod-openapi';

export function configureOpenAPI(app: OpenAPIHono<any, any, any>) {
    app.openAPIRegistry.registerComponent('securitySchemes', 'bearerAuth', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
    });

    app.doc('/doc', {
        openapi: '3.0.0',
        info: {
            title: 'Samurun API',
            version: '1.0.0',
            description: 'Backend for portfolio & blog',
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    });

    app.get('/swagger', swaggerUI({ url: '/doc' }));
}
