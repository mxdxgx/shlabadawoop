import * as express from 'express';
import { RESOURCES_ROUTES } from './resources.route';

export class RoutesBuilder {
  public router: express.Router = express.Router();

  public buildRoutes() {
    for (const route of RESOURCES_ROUTES) {
      this.router[route.method](
        route.routeParams.route,
        route.routeParams.middlewares,
        route.routeParams.handler,
      );
    }
  }
}
