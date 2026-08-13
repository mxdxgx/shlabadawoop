import type { Request, Response } from 'express';
import { configs } from '../../config/configs';
import { logger } from '../server/logger';

export class BaseController {
  constructor(
    private readonly api: unknown = configs.api,
    private readonly now: () => Date = () => new Date(),
  ) {}

  public readonly getAll = async (
    _req: Request,
    res: Response,
  ): Promise<void> => {
    const timestamp = this.now();
    logger.info(timestamp.toISOString());
    res.status(200).send({ timestamp, api: this.api });
  };
}

export const baseController = new BaseController();
