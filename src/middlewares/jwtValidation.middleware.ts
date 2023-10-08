import * as express from 'express';
import { jwtService } from '../services/jwt.service';

export async function jwtValidatorMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (await jwtService.verify(req.get('Authorization'))) {
    next();
  } else {
    throw new Error('Unauthorized');
    //throw new UnauthorizedError();
  }
}
