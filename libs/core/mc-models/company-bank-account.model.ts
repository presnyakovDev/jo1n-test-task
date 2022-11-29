/* eslint-disable */
export class CompanyBankAccount {
  pointIds: number[];
  bankBic: string;
  bankName: string;
  bankCorrespondentAccount: string;
  bankCurrentAccount: string;

  constructor(item: any) {
    this.pointIds = item.pointIds || [];
    this.bankBic = item.bankBic || null;
    this.bankName = item.bankName || null;
    this.bankCorrespondentAccount = item.bankCorrespondentAccount || null;
    this.bankCurrentAccount = item.bankCurrentAccount || null;
  }
}
