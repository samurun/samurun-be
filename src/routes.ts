import { OpenAPIHono } from '@hono/zod-openapi';
import { techRoute } from './modules/tech/tech.route.js';
import { summaryRoute } from './modules/summary/summary.route.js';
import { authRoute } from './modules/auth/auth.route.js';
import { experienceRoute } from './modules/experience/experience.route.js';

const routes = new OpenAPIHono();

routes.route('/tech', techRoute);
routes.route('/summary', summaryRoute);
routes.route('/auth', authRoute);
routes.route('/experience', experienceRoute);

export default routes;
