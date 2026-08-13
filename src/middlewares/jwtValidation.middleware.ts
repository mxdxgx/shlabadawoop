import * as express from 'express';
import { jwtService } from '../services/jwt.service';

export async function jwtValidatorMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const authorization = req.get('Authorization');
  if (authorization && (await jwtService.verify(authorization))) {
    next();
  } else {
    throw new Error('Unauthorized');
  }
}
