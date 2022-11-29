/* eslint-disable */
export class FmsData {
  code: string;
  caption: string;
  endDate: string;

  constructor(item) {
    this.code = item.code;
    this.caption = item.caption;
    this.endDate = item.endDate;
  }
}
