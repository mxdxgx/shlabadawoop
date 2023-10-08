export class MockRequest implements Partial<Express.Request> {
  public params: unknown = {};

  public body = {};

  public path: string = '';
}

export class MockResponse implements Partial<Express.Response> {
  public headers: Map<string, any> = new Map();

  public setHeader(name: string, val: any): any {
    this.headers.set(name, val);
  }

  public getHeader(name: string): any {
    return this.headers.get(name);
  }

  public status(code: number): any {
    return code;
  }

  public send(body: any): any {
    return body;
  }
}
