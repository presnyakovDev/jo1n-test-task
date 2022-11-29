/* eslint-disable */
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { conformToMask } from 'angular2-text-mask';
import * as moment from 'moment-mini';

import { McUtils } from './mc-utils';

export const MASK_4_DIGITS = [/\d/, /\d/, /\d/, /\d/];
export const MASK_6_DIGITS = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
export const MASK_12_DIGITS = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
export const PASSPORT_SERIE_NUMBER_MASK = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
export const PHONE_MASK = [
  '+',
  '7',
  ' ',
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
];
export const PHONE_MASK_WITHOUT_COUNTRY = [
  '(',
  /[1-9]/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
];
export const PHONE_EXT_MASK = createNumberMask({
  prefix: '',
  allowLeadingZeroes: true,
  includeThousandsSeparator: false,
  integerLimit: 5,
});

export const TURNOVER_MASK = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: ' ',
  suffix: ' тыс. руб',
});

export const SIMPLE_NUMBER_WITH_DECIMAL = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: '',
  decimalSymbol: '.',
  decimalLimit: 4,
  allowDecimal: true,
});

export const PRICE_PERCENT_MASK = createNumberMask({
  prefix: '',
  integerLimit: 9,
  allowDecimal: true,
  decimalLimit: 4,
  thousandsSeparatorSymbol: ' ',
});

export const ANY_SIGN_PRICE_PERCENT_MASK = createNumberMask({
  prefix: '',
  integerLimit: 9,
  allowNegative: true,
  allowDecimal: true,
  decimalLimit: 4,
  thousandsSeparatorSymbol: ' ',
});

export const CURRENCY_MASK = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: ' ',
  suffix: ' руб',
});

export const CURRENCY_MASK_WITH_FRACTION = createNumberMask({
  prefix: '',
  decimalSymbol: '.',
  allowDecimal: true,
  decimalLimit: 2,
  thousandsSeparatorSymbol: ' ',
  suffix: ' ₽',
});

export const PERIOD_IN_MONTHS_MASK = createNumberMask({
  prefix: '',
  integerLimit: 2,
  thousandsSeparatorSymbol: ' ',
  suffix: ' мес',
});

export const MONTHS_MASK = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: ' ',
  suffix: ' мес',
});

export const INN_MASK = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: '',
  allowLeadingZeroes: true,
  integerLimit: 12,
});

export const NON_NEGATIVE_LESS_10000 = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: '',
  allowLeadingZeroes: false,
  integerLimit: 4,
});

export const NON_NEGATIVE = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: '',
  allowLeadingZeroes: false,
  integerLimit: 20,
});

export const OGRN_MASK = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: '',
  allowLeadingZeroes: true,
  integerLimit: 15,
});

export const PERCENT_MASK = createNumberMask({
  prefix: '',
  decimalSymbol: '.',
  allowDecimal: true,
  decimalLimit: 2,
  thousandsSeparatorSymbol: '',
  suffix: ' %',
});

export const YEAR_MASK = [/\d/, /\d/, /\d/, /\d/];
export const DATE_MASK = [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
export const TIME_MASK = [/\d/, /\d/, ':', /\d/, /\d/];
export const DATETIME_MASK = DATE_MASK.concat(' ', TIME_MASK);
export const ISSUER_CODE_MASK = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
export const PASSPORT_MASK = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
export const SNILS_MASK = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, ' ', /\d/, /\d/];
export const CREDIT_CARD_MASK = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
export const CREDIT_CARD_EXPIRES_MASK = [/\d/, /\d/, '/', /\d/, /\d/];
export const ACCOUNT_MASK = [
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];
export const BIC_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
export const KPP_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
export const PASSPORT_SERIES_MASK = [/\d/, /\d/, ' ', /\d/, /\d/];
export const PASSPORT_NUMBER_MASK = [/\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/];
export const ZIP_MASK = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

export class MaskUtils {
  public static maskPhoneGuide(value: string): string {
    if (!value) {
      return value;
    }
    return '+7 ' + conformToMask(value, PHONE_MASK_WITHOUT_COUNTRY, { guide: true }).conformedValue;
  }

  public static checkPhoneValue(conformedValue, config) {
    const val1 = config.rawValue.replace(/(.*)+(.*)\(/, '+7 (');
    const val2 = MaskUtils.demaskPhone(val1);
    const newVal = MaskUtils.maskPhoneGuide(val2);
    return newVal || conformedValue;
  }

  public static checkCurrencyValue(conformedValue, config) {
    if (/^0\sруб\d+$/.test(config.rawValue)) {
      const newStr = config.rawValue.replace(/^0\sруб(\d+)$/g, (match, value) => value + ' руб');
      return newStr;
    }

    return conformedValue;
  }

  public static demaskPhone(maskedValue: string): string {
    if (!maskedValue) {
      return null;
    }
    const demaskedValue = maskedValue[0] === '+' ? maskedValue.replace(/\D+/g, '').slice(1) : maskedValue;
    if (!demaskedValue) {
      return null;
    }
    return demaskedValue;
  }

  public static lastAndFirstName(fullname: string): string {
    if (fullname) {
      const chunks = fullname.split(' ');
      if (chunks.length === 3) {
        return chunks[0] + ' ' + chunks[1];
      } else {
        return fullname;
      }
    }
    return '';
  }

  public static normalizePhone(phone: string): string {
    if (!phone) {
      return null;
    }
    const phoneStripped = McUtils.stripPhone(phone);
    return phoneStripped.length === 10 ? MaskUtils.maskPhone(phoneStripped) : phone;
  }

  public static maskPhone(value: string): string {
    if (!value) {
      return value;
    }
    return conformToMask(value, PHONE_MASK, { guide: false }).conformedValue;
  }

  public static maskPercentMask(value: string): string {
    if (!value) {
      return value;
    }

    return conformToMask(value, PRICE_PERCENT_MASK, { guide: false }).conformedValue;
  }

  public static demaskTurnover(maskedValue: string): number {
    if (!maskedValue) {
      return null;
    }
    if (maskedValue) {
      maskedValue = '' + maskedValue;
    }
    const res = maskedValue.replace(/\D+/g, '');
    return 1000 * +res;
  }

  public static maskTurnover(originalValue: number): number {
    if (!originalValue) {
      return originalValue;
    }
    const res = Math.floor(originalValue / 1000);
    return res;
  }

  public static demaskCurrency(maskedValue: string): number {
    if (!maskedValue) {
      return null;
    }
    if (maskedValue) {
      maskedValue = '' + maskedValue;
    }
    const res = maskedValue.replace(/\D+/g, '');
    return +res;
  }

  public static maskSnils(value: string): string {
    if (!value) {
      return value;
    }

    return conformToMask(value, SNILS_MASK, { guide: true }).conformedValue;
  }

  public static demaskSnils(maskedValue: string): string {
    if (!maskedValue) {
      return null;
    }
    if (maskedValue) {
      maskedValue = '' + maskedValue;
    }
    return maskedValue.replace(/\D+/g, '');
  }

  public static checkSnilsValue(conformedValue, config) {
    const val1 = config.rawValue.replace(/\D/g, '');
    const val2 = MaskUtils.demaskSnils(val1);

    return MaskUtils.maskSnils(val2) || conformedValue;
  }
}
