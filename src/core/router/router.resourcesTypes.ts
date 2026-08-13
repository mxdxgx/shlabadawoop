import { HttpMethod } from '../http/http';
import { IRouteParams } from './router.params';

export class ReadResourceRoute {
  public method: HttpMethod;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.GET;
  }
}

export class WriteResourceRoute {
  public method: HttpMethod;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.POST;
  }
}

export class DeleteResourceRoute {
  public method: HttpMethod;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.DELETE;
  }
}

export class ModifyResourceRoute {
  public method: HttpMethod;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.PATCH;
  }
}

export class ReplaceResourceRoute {
  public method: HttpMethod;

  constructor(public routeParams: IRouteParams) {
    this.method = HttpMethod.PUT;
  }
}
