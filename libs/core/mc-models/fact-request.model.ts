/* eslint-disable */
export class FactRequest {
  code: string;
  requestCode: string;
  filters: any;
  dimensions: string[];

  constructor(requestCode: string, factCode: string, filters: any, dimensions: string[]) {
    this.code = factCode;
    this.requestCode = requestCode;
    this.filters = filters;
    this.dimensions = dimensions;
  }
}
