import { VerifyOptions } from 'jsonwebtoken';

export interface IAuthToken {
  activated: boolean;
  wellKnown: IAuthWellKnown;
  validate: Partial<VerifyOptions>;
}

export interface IAuthWellKnown {
  jwksUri: string;
}
