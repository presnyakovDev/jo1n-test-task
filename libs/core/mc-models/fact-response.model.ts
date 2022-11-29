/* eslint-disable */
export class FactResponse {
  requestCode: string;
  records: FactResponseRecord[];
  total: number;

  constructor(item: any) {
    this.requestCode = item.request.requestCode;
    this.records = item.records ? item.records.map(elem => new FactResponseRecord(elem)) : [];
    this.total = this.records.map(rec => rec.value).reduce((a, b) => a + b, 0);
  }
}

export class FactResponseRecord {
  dimensions: any;
  value: number;

  constructor(item: any) {
    this.dimensions = item.dimensions;
    this.value = item.value;
  }
}
