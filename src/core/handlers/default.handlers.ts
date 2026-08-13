import * as express from 'express';

export type BaseExpressFunction = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => void | Promise<void>;

export type ExpressHandler = BaseExpressFunction;
