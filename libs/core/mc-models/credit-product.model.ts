/* eslint-disable */
import { McUtils } from '../mc-utils';
import { CreditParams } from './credit-params.model';

export class CreditProduct {
  id: number;
  code: string;
  rate: number;
  bankId: number;
  typeCode: 'classic' | 'installment';
  programmId: number;
  programmCode: string;
  programmCaption: string;
  paymentRange: string;
  initAmountRange: string;
  credAmountRange: string;

  paymentNumRanges: string;
  paymentNumMin: number;
  paymentNumMax: number;
  initialPercentMin: number;
  initialPercentMax: number;
  creditAmountMin: number;
  creditAmountMax: number;

  notAvailable: boolean;
  notAvailableReason: string;

  disabledReasons: string[] = [];

  constructor(item) {
    this.id = item.id;
    this.code = item.code;
    this.rate = item.rate;
    this.bankId = item.bankId;
    this.typeCode = item.typeCode;
    this.programmId = item.programmId;
    this.programmCode = item.programmCode;
    this.programmCaption = item.programmCaption;

    this.paymentNumMin = item.paymentNumMin;
    this.paymentNumMax = item.paymentNumMax;
    this.paymentNumRanges = item.paymentNumRanges;
    this.initialPercentMin = item.initialPercentMin;
    this.initialPercentMax = item.initialPercentMax === 0 ? item.initialPercentMax : item.initialPercentMax || null;
    this.creditAmountMin = item.creditAmountMin;
    this.creditAmountMax = item.creditAmountMax;

    this.notAvailable = item.notAvailable;
    this.notAvailableReason = item.notAvailableReason;

    this.paymentRange = item.paymentNumRanges || '' + item.paymentNumMin + '-' + item.paymentNumMax;
    this.initAmountRange =
      '' + item.initialPercentMin + '-' + (item.initialPercentMax === null ? '99' : item.initialPercentMax) + '%';
    this.credAmountRange = '' + item.creditAmountMin + '-' + item.creditAmountMax;

    if (item.initialPercentMin === item.initialPercentMax && item.initialPercentMin !== null) {
      this.initAmountRange = '' + item.initialPercentMin + '%';
    }
  }

  errors(params: CreditParams): string[] {
    const errs = [];
    if (this.creditAmountMax && params.creditAmount > this.creditAmountMax) {
      errs.push('Loan term is lower than permitted');
    }
    if (this.creditAmountMin && params.creditAmount < this.creditAmountMin) {
      errs.push('Loan term is lower than permitted');
    }
    if (this.paymentNumMin && params.paymentNum < this.paymentNumMin) {
      errs.push('Loan term is lower than permitted');
    }
    if (this.paymentNumMax && params.paymentNum > this.paymentNumMax) {
      errs.push('Loan term is lower than permitted');
    }
    if (this.paymentNumRanges) {
      let ok = false;
      const chunks = this.paymentNumRanges.split(',');
      chunks.forEach(chunk => {
        if (chunk.indexOf('-') > 0) {
          const chunks0 = chunk.split('-');
          if (chunks0.length === 2) {
            if (McUtils.isNumeric(chunks0[0]) && McUtils.isNumeric(chunks0[1])) {
              const from = +chunks0[0];
              const to = +chunks0[1];
              if (params.paymentNum >= from && params.paymentNum <= to) {
                ok = true;
              }
            }
          }
        } else {
          if (chunk === params.paymentNum.toString()) {
            ok = true;
          }
        }
      });
      if (!ok) {
        errs.push('Loan term not suitable');
      }
    }
    if (this.initialPercentMin && params.initAmountPercent < this.initialPercentMin) {
      errs.push(
        'First payment (' + params.initAmountPercent + '%) lower than permitted (' + this.initialPercentMin + '%)',
      );
    }
    if (this.initialPercentMax && params.initAmountPercent > this.initialPercentMax) {
      errs.push(
        'First payment (' + params.initAmountPercent + '%) higher than permitted (' + this.initialPercentMax + '%)',
      );
    }
    return errs;
  }
}
