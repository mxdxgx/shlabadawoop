import * as config from 'config';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { IAuthToken } from '../src/models/authToken.model';
import * as path from 'path';
import { PrintUtils } from '../src/utils/printUtils';

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

    this.printConfigFilesInOrder();
  }

  get api(): unknown {
    return {
      version: this.apiVersion,
    };
  }

  get typeOrm(): PostgresConnectionOptions {
    return this.ormConfig;
  }

  /**
   * @function printConfigFilesInOrder
   * @private
   * @return void
   *
   * Basic print function that formats the config filenames as they appear in loading order.
   */
  private printConfigFilesInOrder() {
    console.log('Configuration files in order : ');
    console.log('####################################################');

    for (const source of config.util.getConfigSources()) {
      const boundary = PrintUtils.createBoundary(path.basename(source.name));
      console.log(boundary);
    }

    console.log('####################################################');
  }
}

export const configs: Configuration = new Configuration();
