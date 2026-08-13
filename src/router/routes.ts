import * as express from 'express';
import { RESOURCES_ROUTES } from './resources.route';
import { configs } from '../../config/configs';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidation.middleware';

export class RoutesBuilder {
  public router: express.Router = express.Router();

  public buildRoutes() {
    for (const route of RESOURCES_ROUTES) {
      const middlewares = route.routeParams.middlewares ?? [];
      this.router[route.method](
        route.routeParams.route,
        configs.auth.activated
          ? middlewares.concat(jwtValidatorMiddleware)
          : middlewares,
        route.routeParams.handler,
      );
    }
  }
}
