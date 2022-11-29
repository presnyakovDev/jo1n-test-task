/* eslint-disable */
import { McUtils } from '../mc-utils';

export class CreditParams {
  creditAmount: number;
  initAmount: number;
  paymentNum: number;

  get initAmountPercent(): number {
    if (this.creditAmount > 0) {
      return (100 * this.initAmount) / (this.creditAmount + this.initAmount);
    } else {
      return 0;
    }
  }

  constructor(item) {
    this.creditAmount = item.creditAmount;
    this.initAmount = item.initAmount;
    this.paymentNum = item.paymentNum;
  }

  toString(): string {
    return (
      'Credit amount: ' +
      McUtils.formatSumm(this.creditAmount, 2) +
      '€' +
      ', First payment: ' +
      McUtils.formatSumm(this.initAmount, 2) +
      '€' +
      ', Term: ' +
      this.paymentNum +
      ' month'
    );
  }
}
