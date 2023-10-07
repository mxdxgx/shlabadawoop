import {
  BaseExpressFunction,
  ExpressHandler,
} from '../handlers/default.handlers';

export interface IRouteParams {
  middlewares?: BaseExpressFunction[];
  handler: ExpressHandler;
  route: string;
}
