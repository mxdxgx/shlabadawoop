import * as config from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Configuration {
  private readonly apiVersion: string;

  private readonly ormConfig: PostgresConnectionOptions;

  private readonly jwksUri: string;

  constructor() {
    this.apiVersion = <string>config.get('api.version');
    this.ormConfig = <PostgresConnectionOptions>config.get('typeorm');
    this.jwksUri = <string>config.get('auth.wellKnown.jwksUri');
  }

  get auth(): unknown {
    return {
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
