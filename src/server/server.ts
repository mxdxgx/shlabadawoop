import * as express from 'express';
import * as expressWinston from 'express-winston';
import * as winston from 'winston';
import { RoutesBuilder } from '../router/routes';

import 'reflect-metadata';

/**
 * create & configure server
 */
const app: express.Application = express();
const port = process.env.EXPRESS_PORT || 3000;
const routes: RoutesBuilder = new RoutesBuilder();
routes.buildRoutes();
app.use(routes.router);

/**
 * create global logger
 */
export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: 'debug' }),
    new winston.transports.File({
      filename: `${new Date().toISOString().split('T')[0]}.shlabadawoop.log`,
      level: 'debug',
      dirname: 'logs',
    }),
  ],
});

/**
 * configure error logger
 */
app.use(
  expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({ level: 'silly' }),
      new winston.transports.File({
        filename: `${
          new Date().toISOString().split('T')[0]
        }.shlabadawoop.ERR.log`,
        level: 'debug',
        dirname: 'logs',
      }),
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json(),
    ),
  }),
);

/**
 * start server
 */
app.listen(port, () => {
  console.log('server started on port : ', port);
});
