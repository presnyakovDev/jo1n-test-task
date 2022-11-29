/* eslint-disable */
export class PageData {
  public items: any[];
  public loading: boolean;
  public reason: any;
  public error: string;

  constructor(item) {
    this.items = item.items;
    this.loading = item.loading;
    this.reason = item.reason;
    this.error = item.error;
  }
}
