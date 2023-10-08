import {
  DeleteResourceRoute,
  ModifyResourceRoute,
  ReadResourceRoute,
  ReplaceResourceRoute,
  WriteResourceRoute,
} from './router.resourcesTypes';
import { assert } from 'chai';
import { HttpMethod } from '../http/http';

describe('router.resourcesTypes.ts', () => {
  describe('has types in range REST', () => {
    it('has READ type (GET)', () => {
      const readForGet: ReadResourceRoute = new ReadResourceRoute({
        handler: () => {},
        route: '/someRoute',
      });
      assert.deepEqual(readForGet.method, HttpMethod.GET);
    });

    it('has WRITE type (POST)', () => {
      const testRoute: WriteResourceRoute = new WriteResourceRoute({
        handler: () => {},
        route: '/someRoute',
      });
      assert.deepEqual(testRoute.method, HttpMethod.POST);
    });

    it('has WRITE type (POST)', () => {
      const testRoute: DeleteResourceRoute = new DeleteResourceRoute({
        handler: () => {},
        route: '/someRoute',
      });
      assert.deepEqual(testRoute.method, HttpMethod.DELETE);
    });

    it('has MODIFY type (PATCH)', () => {
      const testRoute: ModifyResourceRoute = new ModifyResourceRoute({
        handler: () => {},
        route: '/someRoute',
      });
      assert.deepEqual(testRoute.method, HttpMethod.PATCH);
    });

    it('has REPLACE type (PUT)', () => {
      const testRoute: ReplaceResourceRoute = new ReplaceResourceRoute({
        handler: () => {},
        route: '/someRoute',
      });
      assert.deepEqual(testRoute.method, HttpMethod.PUT);
    });
  });
});
