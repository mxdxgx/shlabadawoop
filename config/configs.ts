import config from 'config';
import path from 'node:path';
import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { IAuthToken } from '../src/models/authToken.model';
import { PrintUtils } from '../src/utils/printUtils';

export class Configuration {
  private readonly apiVersion: string;
  private readonly ormConfig: PostgresConnectionOptions;
  public readonly auth: IAuthToken;

  constructor(private readonly log: (message: string) => void = console.log) {
    this.apiVersion = config.get<string>('api.version');
    this.ormConfig = config.get<PostgresConnectionOptions>('typeorm');
    this.auth = {
      activated: config.get<boolean>('auth.activated'),
      validate: {
        issuer: config.get<string>('auth.validate.issuer'),
        audience: config.get<string>('auth.validate.audience'),
      },
      wellKnown: {
        jwksUri: config.get<string>('auth.wellKnown.jwksUri'),
      },
    };
    this.printConfigFilesInOrder();
  }

  get api(): { version: string } {
    return { version: this.apiVersion };
  }

  get typeOrm(): PostgresConnectionOptions {
    return this.ormConfig;
  }

  private printConfigFilesInOrder(): void {
    this.log('Configuration files in order : ');
    this.log('####################################################');
    for (const source of config.util.getConfigSources()) {
      this.log(PrintUtils.createBoundary(path.basename(source.name)));
    }
    this.log('####################################################');
  }
}

export const configs = new Configuration();
