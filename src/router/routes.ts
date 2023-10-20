import * as express from 'express';
import { RESOURCES_ROUTES } from './resources.route';
import { configs } from '../../config/configs';
import { jwtValidatorMiddleware } from '../middlewares/jwtValidation.middleware';

export class RoutesBuilder {
  public router: express.Router = express.Router();

  public buildRoutes() {
    for (const route of RESOURCES_ROUTES) {
      this.router[route.method](
        route.routeParams.route,
        configs.auth.activated
          ? route.routeParams.middlewares.concat(jwtValidatorMiddleware)
          : route.routeParams.middlewares,
        route.routeParams.handler,
      );
    }
  }
}
