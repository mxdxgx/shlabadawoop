import { assert } from 'chai';
import express from 'express';
import sinon from 'sinon';
import { logger } from './server/logger';
import { main, startServer } from './start';

describe('startup', () => {
  afterEach(() => sinon.restore());

  it('starts an HTTP server and reports its address', async () => {
    const info = sinon.stub(logger, 'info');
    const server = await startServer(async () => express(), 0);
    await new Promise<void>((resolve) => {
      if (server.listening) resolve();
      else server.once('listening', resolve);
    });
    assert.isTrue(server.listening);
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.match(String(info.firstCall.args[0]), /server started/);
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  });

  it('uses startup defaults', async () => {
    const originalPort = process.env.EXPRESS_PORT;
    process.env.EXPRESS_PORT = '0';
    const server = await startServer();
    await new Promise<void>((resolve) => {
      if (server.listening) resolve();
      else server.once('listening', resolve);
    });
    await new Promise<void>((resolve) => server.close(() => resolve()));
    if (originalPort === undefined) delete process.env.EXPRESS_PORT;
    else process.env.EXPRESS_PORT = originalPort;
  });

  it('uses the default port when the environment does not specify one', async () => {
    const originalPort = process.env.EXPRESS_PORT;
    delete process.env.EXPRESS_PORT;
    const fakeServer = {} as import('node:http').Server;
    const listen = sinon
      .stub()
      .callsFake((port: number, callback: () => void) => {
        assert.equal(port, 3000);
        callback();
        return fakeServer;
      });
    const result = await startServer(
      async () => ({ listen }) as unknown as express.Application,
    );
    assert.equal(result, fakeServer);
    if (originalPort !== undefined) process.env.EXPRESS_PORT = originalPort;
  });

  it('runs main with its production defaults', async () => {
    const originalPort = process.env.EXPRESS_PORT;
    process.env.EXPRESS_PORT = '0';
    const server = await main();
    assert.isDefined(server);
    await new Promise<void>((resolve) => server?.close(() => resolve()));
    if (originalPort === undefined) delete process.env.EXPRESS_PORT;
    else process.env.EXPRESS_PORT = originalPort;
  });

  it('completes main after successful startup', async () => {
    const server = express().listen(0);
    await main(async () => server);
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });

  it('reports fatal startup failures and exits', async () => {
    const failure = new Error('startup failed');
    const report = sinon.spy();
    const exitCodes: number[] = [];
    const exit = (code: number): never => {
      exitCodes.push(code);
      throw new Error('exit called');
    };
    try {
      await main(async () => Promise.reject(failure), report, exit);
      assert.fail('expected exit');
    } catch (error) {
      assert.equal((error as Error).message, 'exit called');
    }
    assert.isTrue(report.calledWith(failure));
    assert.deepEqual(exitCodes, [1]);
  });
});
