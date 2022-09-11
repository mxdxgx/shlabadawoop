import * as express from 'express';
import { configs } from '../../config/configs';

export class BaseController {
  public async getAll(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    req.log.info(`${new Date()}`);

    res.status(200).send({ a: 'hello', api: configs.api });
  }
}

export const baseController: BaseController = new BaseController();
