import { createDefaultApp, logger } from './server/server';

(async () => {
  const port = process.env.EXPRESS_PORT || 3000;
  try {
    (await createDefaultApp()).listen(port, () => {
      logger.info(`server started at http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
