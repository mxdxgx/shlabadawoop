import type { Server } from 'node:http';
import type { Application } from 'express';
import { createDefaultApp, logger } from './server/server';

export type AppFactory = () => Promise<Application>;

export async function startServer(
  appFactory: AppFactory = createDefaultApp,
  port: string | number = process.env.EXPRESS_PORT ?? 3000,
): Promise<Server> {
  const app = await appFactory();
  return app.listen(port, () => {
    logger.info(`server started at http://localhost:${port}`);
  });
}

export async function main(
  start: () => Promise<Server> = startServer,
  reportError: (error: unknown) => void = console.error,
  exit: (code: number) => never = process.exit,
): Promise<Server | void> {
  try {
    return await start();
  } catch (error) {
    reportError(error);
    exit(1);
  }
}

/* istanbul ignore next -- executable-module bootstrap, exercised by smoke test */
if (require.main === module) {
  void main();
}
