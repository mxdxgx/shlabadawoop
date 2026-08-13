import express, { type RequestHandler, type Router } from 'express';
import { configs } from '../../config/configs';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidation.middleware';
import { RESOURCES_ROUTES } from './resources.route';
import type { ReadResourceRoute } from '../core/router/router.resourcesTypes';

export class RoutesBuilder {
  public readonly router: Router;

  constructor(
    private readonly authEnabled = configs.auth.activated,
    private readonly authMiddleware: RequestHandler = jwtValidatorMiddleware,
    router: Router = express.Router(),
    private readonly routes: ReadResourceRoute[] = RESOURCES_ROUTES,
  ) {
    this.router = router;
  }

  public buildRoutes(): void {
    for (const route of this.routes) {
      const middlewares = route.routeParams.middlewares ?? [];
      const handlers = this.authEnabled
        ? [...middlewares, this.authMiddleware]
        : middlewares;
      this.router[route.method](
        route.routeParams.route,
        handlers,
        route.routeParams.handler,
      );
    }
  }
}
