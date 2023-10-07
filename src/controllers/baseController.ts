import * as express from 'express';
import { configs } from '../../config/configs';
import { logger } from '../server/server';

export class BaseController {
  public async getAll(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    logger.info(`${new Date()}`);
    res.status(200).send({ timestamp: new Date(), api: configs.api });
  }
}

export const baseController: BaseController = new BaseController();
