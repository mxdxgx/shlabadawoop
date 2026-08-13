import { assert } from 'chai';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import sinon from 'sinon';
import request from 'supertest';
import { BaseController } from './controllers/baseController';
import { exampleMiddleware } from './middlewares/example.middleware';
import { jwtValidatorMiddleware } from './middlewares/jwtValidation.middleware';
import { RoutesBuilder } from './router/routes';
import { ReadResourceRoute } from './core/router/router.resourcesTypes';
import { createDefaultApp, logger } from './server/server';
import { jwtService } from './services/jwt.service';
import { PrintUtils } from './utils/printUtils';

describe('application', () => {
  afterEach(() => sinon.restore());

  it('formats both short and over-width configuration boundaries', () => {
    assert.lengthOf(PrintUtils.createBoundary('default.yaml'), 52);
    assert.equal(
      PrintUtils.createBoundary('x'.repeat(60)),
      `# ${'x'.repeat(60)} #`,
    );
  });

  it('runs the example middleware', () => {
    const next = sinon.spy();
    exampleMiddleware({} as Request, {} as Response, next as NextFunction);
    assert.isTrue(next.calledOnce);
  });

  it('returns controller data with a deterministic timestamp', async () => {
    const timestamp = new Date('2026-08-13T12:00:00Z');
    const send = sinon.spy();
    const response = {
      status: sinon.stub().returns({ send }),
    } as unknown as Response;
    const log = sinon.stub(logger, 'info');
    await new BaseController({ version: 'test' }, () => timestamp).getAll(
      {} as Request,
      response,
    );
    assert.equal((log.firstCall.args as unknown[])[0], timestamp.toISOString());
    assert.isTrue(send.calledWith({ timestamp, api: { version: 'test' } }));
  });

  it('serves the configured route', async () => {
    const app = await createDefaultApp();
    const response = await request(app).get('/alphabet');
    assert.equal(response.status, 200);
    assert.equal(response.body.api.version, '1.5.1-local');
    assert.match(response.body.timestamp, /^\d{4}-/);
  });

  it('builds a route with no middleware', async () => {
    const route = new ReadResourceRoute({
      route: '/plain',
      handler: (_req, res) => {
        res.send('ok');
      },
    });
    const builder = new RoutesBuilder(
      false,
      jwtValidatorMiddleware,
      undefined,
      [route],
    );
    builder.buildRoutes();
    const app = (await import('express')).default().use(builder.router);
    assert.equal((await request(app).get('/plain')).text, 'ok');
  });

  it('builds routes with authentication enabled', async () => {
    const auth: RequestHandler = (_req, _res, next) => next();
    const builder = new RoutesBuilder(true, auth);
    builder.buildRoutes();
    const app = (await import('express')).default().use(builder.router);
    assert.equal((await request(app).get('/alphabet')).status, 200);
  });

  it('accepts valid authorization and rejects missing authorization', async () => {
    const verify = sinon.stub(jwtService, 'verify').resolves(true);
    const next = sinon.spy();
    const req = {
      get: sinon.stub().returns('Bearer token'),
    } as unknown as Request;
    await jwtValidatorMiddleware(req, {} as Response, next as NextFunction);
    assert.isTrue(verify.calledWith('Bearer token'));
    assert.isTrue(next.calledOnce);

    const missing = {
      get: sinon.stub().returns(undefined),
    } as unknown as Request;
    try {
      await jwtValidatorMiddleware(
        missing,
        {} as Response,
        next as NextFunction,
      );
      assert.fail('expected rejection');
    } catch (error) {
      assert.equal((error as Error).message, 'Unauthorized');
    }
  });

  it('rejects authorization when verification returns false', async () => {
    sinon.stub(jwtService, 'verify').resolves(false);
    const req = { get: sinon.stub().returns('bad') } as unknown as Request;
    try {
      await jwtValidatorMiddleware(
        req,
        {} as Response,
        sinon.spy() as NextFunction,
      );
      assert.fail('expected rejection');
    } catch (error) {
      assert.equal((error as Error).message, 'Unauthorized');
    }
  });
});
