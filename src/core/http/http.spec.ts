import { HttpMethod } from './http';
import { assert } from 'chai';

describe('shlabadawoop', () => {
  describe('HttpMethod', () => {
    it('should have GET | POST | PUT | PATCH | DELETE methods as *name*', () => {
      const httpMethodsList: string[] = Object.values(HttpMethod);
      assert.lengthOf(httpMethodsList, 5);
      assert.deepEqual(httpMethodsList, [
        'get',
        'put',
        'delete',
        'post',
        'patch',
      ]);
    });
  });
});
