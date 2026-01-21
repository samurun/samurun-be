import { OpenAPIHono } from '@hono/zod-openapi';
import { techRoute } from './tech.js';
import { summaryRoute } from './summary.js';
import { authRoute } from './auth.js';
import { experienceRoute } from './experience.js';

const v1Router = new OpenAPIHono();

v1Router.route('/tech', techRoute);
v1Router.route('/summary', summaryRoute);
v1Router.route('/auth', authRoute);
v1Router.route('/experience', experienceRoute);

export default v1Router;
