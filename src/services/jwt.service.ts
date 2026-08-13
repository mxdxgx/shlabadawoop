import jwt, {
  type GetPublicKeyOrSecret,
  type JwtHeader,
  type SigningKeyCallback,
  type VerifyOptions,
} from 'jsonwebtoken';
import jwksClient, { type JwksClient } from 'jwks-rsa';
import { configs } from '../../config/configs';

export type TokenVerifier = typeof jwt.verify;

export class JwtService {
  private readonly options: VerifyOptions;
  private readonly client: JwksClient;

  constructor(
    client: JwksClient = jwksClient({
      jwksUri: configs.auth.wellKnown.jwksUri,
    }),
    private readonly tokenVerifier: TokenVerifier = jwt.verify,
  ) {
    this.client = client;
    this.options = {
      audience: configs.auth.validate.audience,
      issuer: configs.auth.validate.issuer,
    };
  }

  private readonly getKey: GetPublicKeyOrSecret = (
    header: JwtHeader,
    callback: SigningKeyCallback,
  ): void => {
    if (!header.kid) {
      callback(new Error('JWT header does not contain a key ID'));
      return;
    }
    this.client.getSigningKey(header.kid, (error, key) => {
      if (error || !key) {
        callback(error ?? new Error('Unable to retrieve the signing key'));
        return;
      }
      callback(null, key.getPublicKey());
    });
  };

  public verify(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.tokenVerifier(token, this.getKey, this.options, (error, decoded) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(decoded !== undefined);
      });
    });
  }
}

export const jwtService = new JwtService();
