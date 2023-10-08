import { HttpMethod } from '../http/http';
import { IRouteParams } from './router.params';

export class ReadResourceRoute {
  public method: string;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.GET;
  }
}

export class WriteResourceRoute {
  public method: string;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.POST;
  }
}

export class DeleteResourceRoute {
  public method: string;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.DELETE;
  }
}

export class ModifyResourceRoute {
  public method: string;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.PATCH;
  }
}

export class ReplaceResourceRoute {
  public method: string;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.PUT;
  }
}
