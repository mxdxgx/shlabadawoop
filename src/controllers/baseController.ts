import * as express from 'express';
import { logger } from '../server/server';
import { ConfigValue } from '../../config/decorators/configvalue.decorator';
import autobind from '../../config/decorators/autobind.decorator';

@autobind
export class BaseController {
  @ConfigValue('api')
  private readonly api: any;

  public async getAll(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    logger.info(`${new Date()}`);
    res.status(200).send({ timestamp: new Date(), api: this.api });
  }
}

export const baseController: BaseController = new BaseController();
