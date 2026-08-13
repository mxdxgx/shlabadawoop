import { assert } from 'chai';
import { Configuration, configs } from './configs';
import { typeOrmConfig } from './orm.config';

describe('Configuration', () => {
  it('loads typed values and reports configuration sources', () => {
    const messages: string[] = [];
    const configuration = new Configuration((message) =>
      messages.push(message),
    );
    assert.deepEqual(configuration.api, { version: '1.5.1-local' });
    assert.equal(configuration.auth.activated, false);
    assert.equal(configuration.auth.validate.audience, 'aud-shlabadawoop');
    assert.equal(configuration.typeOrm.type, 'postgres');
    assert.match(messages.join('\n'), /default\.yaml/);
    assert.deepEqual(typeOrmConfig, configs.typeOrm);
  });
});
