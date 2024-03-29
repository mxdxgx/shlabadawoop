import { baseController } from '../controllers/baseController';
import { ReadResourceRoute } from '../core/router/router.resourcesTypes';
import { exampleMiddleware } from '../middlewares/example.middleware';

export const RESOURCES_ROUTES = [
  new ReadResourceRoute({
    route: '/alphabet',
    middlewares: [exampleMiddleware],
    handler: baseController.getAll,
  }),
];
