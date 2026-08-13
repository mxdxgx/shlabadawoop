import jwt, {
  type GetPublicKeyOrSecret,
  type JwtHeader,
  type SigningKeyCallback,
  type VerifyOptions,
} from 'jsonwebtoken';
import jwksClient, { type JwksClient } from 'jwks-rsa';
import { ConfigValue } from '../../config/decorators/configvalue.decorator';

export class JwtService {
  @ConfigValue('auth.validate.audience')
  private readonly audience!: string;

  @ConfigValue('auth.validate.issuer')
  private readonly issuer!: string;

  @ConfigValue('auth.wellKnown.jwksUri')
  private readonly jwksUri!: string;

  private readonly options: VerifyOptions;
  private readonly client: JwksClient;

  constructor() {
    this.options = {
      audience: this.audience,
      issuer: this.issuer,
    };
    this.client = jwksClient({ jwksUri: this.jwksUri });
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

  public async verify(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.getKey, this.options, (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded !== undefined);
        }
      });
    });
  }
}

export const jwtService: JwtService = new JwtService();
