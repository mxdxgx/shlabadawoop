import * as jwksclient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { VerifyOptions } from 'jsonwebtoken';
import { ConfigValue } from '../../config/decorators/configvalue.decorator';

export class JwtService {
  @ConfigValue('auth.validate.audience')
  private audience: string;

  @ConfigValue('auth.validate.issuer')
  private issuer: string;

  @ConfigValue('auth.wellKnown.jwksUri')
  private jwksUri: string;

  private options: VerifyOptions;

  private client;

  constructor() {
    this.options = {
      audience: this.audience,
      issuer: this.issuer,
    };
    this.client = jwksclient({
      jwksUri: this.jwksUri,
    });
  }

  private getkey(header, callback) {
    this.client.getSigningKey(header.kid, function (err, key) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const signingKey = key.getPublicKey() || key.getRsaPublicKey();
      callback(null, signingKey);
    });
  }

  public async verify(token: string) {
    return new Promise((reject, resolve) => {
      jwt.verify(token, this.getkey, this.options, (error, decoded) => {
        if (error) {
          reject(error);
        } else if (decoded) {
          resolve(true);
        }
      });
    });
  }
}

export const jwtService: JwtService = new JwtService();
