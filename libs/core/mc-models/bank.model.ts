/* eslint-disable */
export class Bank {
  id: number;
  name: string;
  shortName: string;
  code: string;
  legalAddress: string;
  officialName: string;
  status: string;

  get caption(): string {
    return this.name;
  }

  constructor(item) {
    this.id = item.id;
    this.status = item.status;
    this.code = item.code;
    this.name = item.name || '';
    this.shortName = item.shortName || '';
    this.legalAddress = item.legalAddress || '';
    this.officialName = item.officialName || '';
  }
}
