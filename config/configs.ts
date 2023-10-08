import * as config from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { IAuthToken } from '../src/models/authToken.model';

export class Configuration {
  private readonly apiVersion: string;

  private readonly ormConfig: PostgresConnectionOptions;

  private readonly jwksUri: string;

  private readonly audience: string;

  private readonly issuer: string;

  private readonly authActivated: boolean;

  constructor() {
    this.apiVersion = <string>config.get('api.version');
    this.ormConfig = <PostgresConnectionOptions>config.get('typeorm');

    this.jwksUri = <string>config.get('auth.wellKnown.jwksUri');
    this.audience = <string>config.get('auth.validate.audience');
    this.issuer = <string>config.get('auth.validate.issuer');
    this.authActivated = <boolean>config.get('auth.activated');
  }

  get auth(): IAuthToken {
    return {
      activated: this.authActivated,
      validate: {
        issuer: this.issuer,
        audience: this.audience,
      },
      wellKnown: {
        jwksUri: this.jwksUri,
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
