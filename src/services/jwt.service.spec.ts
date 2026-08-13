import { assert } from 'chai';
import type { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import type { JwksClient, SigningKey } from 'jwks-rsa';
import { JwtService, type TokenVerifier } from './jwt.service';

type KeyCallback = (error: Error | null, key?: SigningKey) => void;

function clientWith(callback: (callback: KeyCallback) => void): JwksClient {
  return {
    getSigningKey: (_kid: string, done: KeyCallback) => callback(done),
  } as JwksClient;
}

type TestVerifyCallback = (error: Error | null, decoded?: object) => void;

function verifierForHeader(
  header: JwtHeader,
  outcome: { error?: Error; decoded?: object },
): TokenVerifier {
  return ((
    _token: string,
    getKey: (header: JwtHeader, callback: SigningKeyCallback) => void,
    _options: object,
    done: TestVerifyCallback,
  ) => {
    getKey(
      header,
      (keyError: Error | null, key?: Parameters<SigningKeyCallback>[1]) => {
        if (keyError) {
          done(keyError);
          return;
        }
        assert.equal(key, 'public-key');
        done(outcome.error ?? null, outcome.decoded);
      },
    );
  }) as unknown as TokenVerifier;
}

describe('JwtService', () => {
  it('verifies a token with a resolved signing key', async () => {
    const key = { getPublicKey: () => 'public-key' } as SigningKey;
    const service = new JwtService(
      clientWith((done) => done(null, key)),
      verifierForHeader(
        { alg: 'RS256', kid: 'key-id' },
        { decoded: { sub: 'subject' } },
      ),
    );
    assert.isTrue(await service.verify('token'));
  });

  it('returns false when verification has no decoded payload', async () => {
    const key = { getPublicKey: () => 'public-key' } as SigningKey;
    const service = new JwtService(
      clientWith((done) => done(null, key)),
      verifierForHeader({ alg: 'RS256', kid: 'key-id' }, {}),
    );
    assert.isFalse(await service.verify('token'));
  });

  for (const scenario of [
    {
      name: 'missing key id',
      header: { alg: 'RS256' },
      client: clientWith(() => assert.fail('client should not be called')),
      message: 'JWT header does not contain a key ID',
    },
    {
      name: 'key lookup error',
      header: { alg: 'RS256', kid: 'key-id' },
      client: clientWith((done) => done(new Error('lookup failed'))),
      message: 'lookup failed',
    },
    {
      name: 'empty key lookup',
      header: { alg: 'RS256', kid: 'key-id' },
      client: clientWith((done) => done(null)),
      message: 'Unable to retrieve the signing key',
    },
  ]) {
    it(`rejects a token with ${scenario.name}`, async () => {
      const service = new JwtService(
        scenario.client,
        verifierForHeader(scenario.header, {}),
      );
      try {
        await service.verify('token');
        assert.fail('expected rejection');
      } catch (error) {
        assert.equal((error as Error).message, scenario.message);
      }
    });
  }

  it('propagates token verification errors', async () => {
    const key = { getPublicKey: () => 'public-key' } as SigningKey;
    const service = new JwtService(
      clientWith((done) => done(null, key)),
      verifierForHeader(
        { alg: 'RS256', kid: 'key-id' },
        { error: new Error('invalid token') },
      ),
    );
    try {
      await service.verify('token');
      assert.fail('expected rejection');
    } catch (error) {
      assert.equal((error as Error).message, 'invalid token');
    }
  });
});
