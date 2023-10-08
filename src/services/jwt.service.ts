import * as jwksclient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import { VerifyOptions } from 'jsonwebtoken';
import { configs } from '../../config/configs';

export class JwtService {
  private readonly options: VerifyOptions = {
    audience: configs.auth.validate.audience,
    issuer: configs.auth.validate.issuer,
  };

  private readonly client = jwksclient({
    jwksUri: configs.auth.wellKnown.jwksUri,
  });

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
