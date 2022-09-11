import * as express from 'express';
import * as pinoExpress from 'express-pino-logger';
import * as pino from 'pino';
import { RoutesBuilder } from '../router/routes';

const logger: pino.Logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  prettyPrint: process.env.NODE_ENV === 'development',
});

const appLogger: pinoExpress.HttpLogger = pinoExpress({ logger });
const app: express.Application = express();
const port = process.env.EXPRESS_PORT || 3000;

const routes: RoutesBuilder = new RoutesBuilder();
routes.buildRoutes();

app.use(appLogger);
app.use(routes.router);

app.listen(port, () => {
  logger.info(`server started at http://localhost:${port}`);
});
