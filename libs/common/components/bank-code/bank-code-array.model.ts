/* eslint-disable */
import { Bank, Point } from '@mc/core';

export interface BankCodeItem {
  code: string;
  disableReason: string;
  firstSendDate: string;
}
export class BankCodeArray {
  banks: Bank[] = [];
  codes = new Map<string, BankCodeItem>();

  static getFromItems(items: any[], banks: Bank[]): BankCodeArray {
    const res = new BankCodeArray();
    items.forEach(item => {
      item.bankCodes.forEach(code => {
        const bank = banks.find(elem => elem.id === code.integrationId);
        if (bank) {
          if (!res.banks.some(elem => elem.id === code.integrationId)) {
            res.banks.push(bank);
          }
          const codeString = code.disabled ? null : item instanceof Point ? code.code : code.username;
          const reasonString = code.disabled ? code.disableReason : null;
          const requestDate = codeString || reasonString ? null : code.firstSendDate;
          const mapKey = '' + item.id + '.' + code.integrationId;
          const codeElem = {
            code: codeString,
            disableReason: reasonString
              ? reasonString.replace('Не кредитуемый', 'Некредитуемый').replace('службой безопасности', 'СБ')
              : null,
            firstSendDate: requestDate,
          };
          res.codes.set(mapKey, codeElem);
        }
      });
    });
    return res;
  }
}
