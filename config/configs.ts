import * as config from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { IAuthToken } from '../src/models/authToken.model';

export class Configuration {
  private readonly apiVersion: string;

  private readonly ormConfig: PostgresConnectionOptions;

  public readonly auth: IAuthToken;

  constructor() {
    this.apiVersion = <string>config.get('api.version');
    this.ormConfig = <PostgresConnectionOptions>config.get('typeorm');

    this.auth = {
      activated: <boolean>config.get('auth.activated'),
      validate: {
        issuer: <string>config.get('auth.validate.issuer'),
        audience: <string>config.get('auth.validate.audience'),
      },
      wellKnown: {
        jwksUri: <string>config.get('auth.wellKnown.jwksUri'),
      },
    };
  }

  get api(): unknown {
    return {
      version: this.apiVersion,
    };
  }

  get typeOrm(): PostgresConnectionOptions {
    return this.ormConfig;
  }
}

export const configs: Configuration = new Configuration();
