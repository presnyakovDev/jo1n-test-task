/* eslint-disable */
import { OGRN_MASK } from './mc-masks';
import { Bank } from './mc-models/bank.model';
import { ControlDoc } from './mc-models/control-doc.model';
import { ParamType } from './mc-models/param-type.model';

export class TargetsCommon {
  public static ByMonthsMinMaxParamProcessor(value: string, banks: Bank[]) {
    let result = 'ERR';
    try {
      const results = [];
      const lines = JSON.parse(value);
      lines.forEach((line, index) => {
        const interval =
          index + 1 < lines.length ? '' + line.from + '-' + lines[index + 1].from + ' мес' : '' + line.from + '+ мес';
        let interval2 = '?';
        if (line.value) {
          if (line.value2) {
            interval2 = 'от ' + line.value + ' до ' + line.value2 + '%';
          } else {
            interval2 = 'не менее ' + line.value + '%';
          }
        } else {
          if (line.value2) {
            interval2 = 'не более ' + line.value2 + '%';
          } else {
            interval2 = 'без огр.';
          }
        }
        results.push(interval + ' - ' + interval2);
      });
      result = results.join(', ');
    } finally {
      return result;
    }
  }

  public static BankPrioritiesProcessor(value: string, banks: Bank[]) {
    let result = 'ERR';
    try {
      const results = [];
      const lines = JSON.parse(value);
      lines.forEach(line => {
        if (line.priority && line.bankId) {
          const bank = banks.find(item => item.id === line.bankId);
          const bankCaption = bank ? bank.caption : 'Банк #' + line.bankId;
          results.push(bankCaption + ' - ' + line.priority);
        }
      });
      result = results.join(', ');
    } finally {
      return result;
    }
  }

  public static getParamList() {
    return [
      {
        code: 'BANK_PRIORITIES_CORRECTION',
        caption: 'Приоритеты банков',
        type: 'lines',
        processor: this.BankPrioritiesProcessor,
      },
      { code: 'PR4_IF_RATE_BELOW', caption: 'ПР4, если % ставка не выше', type: 'value' },
      {
        code: 'BANK_TARGET_FOR_LOW_PRIORITY',
        caption: 'Доля банка, при превышении которой ставим ПР-4, %',
        type: 'value',
      },
      {
        code: 'FROM_TARGET_AND_RATE_FOR_PARTNER',
        caption: 'Изменить приоритет в определенном диапазоне КП',
        type: 'lines',
      },
      {
        code: 'MIN_MAX_INSTALLMENT_DISCOUNT',
        caption: 'Скидки по сроку',
        type: 'lines',
        intervals: true,
        intervalStep: 1,
        processor: this.ByMonthsMinMaxParamProcessor,
      },
      { code: 'BANK_PRIORITIES_MIN_PR1_QTY', caption: 'Кол-во ПР-1, добираемых из рейтинга', type: 'value' },
      {
        code: 'BANK_PRIORITIES_AV_CUTOFF',
        caption: 'Начиная с какого рейтинга включительно считать АВ как Пр3',
        type: 'value',
      },
      { code: 'SMART_INSTALLMENTS', caption: 'Включить умные рассрочки', type: 'value' },
      { code: 'BANK_PRODUCTS_DISABLE_SMART', caption: 'Отключить нарезку умных и квази для КП', type: 'lines' },
      { code: 'BANK_PRODUCTS_REPLACE', caption: 'Подменять КП и срок', type: 'lines' },
      { code: 'SMART_INSTALLMENTS_DISCOUNT', caption: 'Скидки для формирования умных рассрочек', type: 'value' },
      { code: 'DISCOUNT_SELECTION_MODE', caption: 'Как выбирать рассрочку внутри категории', type: 'value' },
      { code: 'EXT_INSTEAD_BANK_ENABLE', caption: 'Замена банковской страховки на внешнюю', type: 'value' },
      { code: 'BANK_INSURANCES_TARGET', caption: 'Таргет по банковской страховке', type: 'value' },
      { code: 'EXT_INSURANCES_TARGET', caption: 'Таргет по внешней страховке', type: 'value' },
      { code: 'DISABLE_MUKO_ADDONS', caption: 'Запретить МУКО добавлять страховки и СМС', type: 'value' },
      { code: 'NO_INSURANCES_RULES', caption: 'Не добавлять страховки при выполнении условий', type: 'value' },
      { code: 'INSURANCE_FOR_UNLUCKY', caption: 'Страховка, если два отказа', type: 'value' },
      { code: 'SERVICE_ADD_BY_RULES', caption: 'Добавление ДОПа в банк по условиям', type: 'lines' },
      {
        code: 'SERVICE_ADD_FOR_BANK_BY_RULES',
        caption: 'Добавление ДОПа в банк по условиям кроме его сотрудников',
        type: 'lines',
      },
      {
        code: 'EXT_SMS_IF_BANK_TARGET_ACHIEVED',
        caption: 'Внешняя смс вместо банковской, если выполнен таргет',
        type: 'value',
      },
      { code: 'SHOW_SMS_IN_CALC', caption: 'Флажок СМС в калькуляторе', type: 'value' },
      { code: 'BANK_SMS_TARGET', caption: 'Мин. доля банк., %', type: 'value' },
      { code: 'EXT_SMS_TARGET', caption: 'Мин. доля внешн., %', type: 'value' },
      { code: 'EXT_SMS_INSTEAD_BANK_ENABLE', caption: 'Замена на внешнюю', type: 'value' },
      { code: 'BANK_SMS_MAX', caption: 'Макс. доля, %', type: 'value' },
      { code: 'SMS_LIMIT_SCOPE', caption: 'Уровень расчета ФП лимита (по умолч. - ТТ)', type: 'value' },
    ];
  }

  public static setDocBrief(doc: ControlDoc, banks: Bank[]) {
    const briefParts = [];
    const params = this.getParamList();
    params.forEach(param => {
      const value = doc.getParamElem(param.code, 'value');
      if (param.type === 'lines') {
        if (value && value !== '[]') {
          if (param.processor) {
            briefParts.push(param.caption + ': ' + param.processor(value, banks));
          } else {
            briefParts.push(param.caption);
          }
        }
      }
      if (param.type === 'value') {
        if (value) {
          briefParts.push(param.caption + ' ' + value);
        }
      }
    });

    if (briefParts.length) {
      doc.briefParts = briefParts;
      doc.brief = briefParts.join(', ');
    }
  }

  public static getInsuranceTypeVariants(): any[] {
    return [
      {
        id: 'LIFE',
        caption: 'Жизни и здоровья',
      },
      {
        id: 'WORK',
        caption: 'От потери работы',
      },
    ];
  }

  public static discountSelectionModeVariants(): any[] {
    return [
      {
        id: 'MIN',
        caption: 'Минимальный % скидки',
      },
      {
        id: 'MAX',
        caption: 'Максимальный % скидки',
      },
    ];
  }

  public static rateSelectionModeVariants(): any[] {
    return [
      {
        id: 'MIN',
        caption: 'Минимальная % ставка',
      },
      {
        id: 'MAX',
        caption: 'Максимальная % ставка',
      },
    ];
  }

  public static getBankInsurancesTargetUnitVariants(): any[] {
    return [
      {
        id: 'QTY',
        caption: 'шт',
      },
      {
        id: 'SUM',
        caption: 'руб',
      },
    ];
  }

  public static getPartnerDocValidationErrors(doc: ControlDoc, paramTypes: ParamType[]): string[] {
    const errors: string[] = [];

    const fieldSpecs = this.getFieldSpecs();
    const commonDocFields = ControlDoc.getFieldNames(true);

    if (!doc.caption) {
      errors.push('Не указано - ' + commonDocFields['caption']);
    }

    /*
        const kvPayout = doc.getParamField(paramTypes, 'KV_PAYOUT', 'value');
        const kvAccounts = doc.getParamField(paramTypes, 'KV_ACCOUNTS', 'value');
        const kvAccount = doc.getParamField(paramTypes, 'KV_ACCOUNT', 'value');
        if (!kvPayout){
            errors.push('Не указано - ' + fieldNames['KV_PAYOUT']);
        }
        if (!kvAccounts){
            errors.push('Не указано - ' + fieldNames['KV_ACCOUNTS']);
        }
        if (kvAccounts === 'PARTNER' && !kvAccount){
            errors.push('Указано, что начисляем всё КВ на одно ЮЛ, но не указано, на какое');
        }
        */

    return errors;
  }

  public static getFieldSpecs(): any {
    return {
      CATEGORY_CUT: {
        stepperLabel: 'BACKOFFICE.PARTNERS.CMM.LOAN_AMOUNT_RATES',
        paramCaption: 'BACKOFFICE.PARTNERS.CMM.RATE_SETTINGS_BY_LOAN_AMOUNT',
        paramTargetCaption: 'BACKOFFICE.PARTNERS.CMM.LOAN_AMOUNT',
        paramValue1Caption: 'BACKOFFICE.PARTNERS.CMM.MINIMUM_RATE',
        paramValue2Caption: 'BACKOFFICE.PARTNERS.CMM.DEFAULT_RATE',
        paramComment: 'BACKOFFICE.PARTNERS.CMM.WARNING_SELECTED_MIN_RATE',
      },
    };
  }

  public static getInsuranceFactCalcModeVariants(): any[] {
    return [
      {
        id: null,
        caption: 'Наследовать из группы управления',
      },
      {
        id: 'IF_ANY',
        caption: 'Считаем комбо страховку за одну',
      },
      {
        id: 'CALC_BOTH',
        caption: 'Считаем комбо страховку за две',
      },
    ];
  }

  public static getYesNoVariants(): any[] {
    return [
      {
        id: null,
        caption: 'Наследовать из группы управления',
      },
      {
        id: 'NO',
        caption: 'Нет',
      },
      {
        id: 'YES',
        caption: 'Да',
      },
    ];
  }

  public static getForceBankInsuranceVariants(): any[] {
    return [
      {
        id: null,
        caption: 'Наследовать из группы управления',
      },
      {
        id: 'NONE',
        caption: 'Не применяется',
      },
      {
        id: 'BY_PARTNER',
        caption: 'Применять в целом по партнеру',
      },
      {
        id: 'BY_POINT',
        caption: 'Применять по торговым точкам',
      },
      {
        id: 'BY_PARTNER_AND_OPERATOR',
        caption: 'Применять по операторам в рамках партнера',
      },
    ];
  }

  public static getPermissionVariants(): any[] {
    return [
      {
        id: '',
        caption: '-никто-',
      },
      {
        id: 'PERMISSION_MANAGER',
        caption: 'Менеджер',
      },
      {
        id: 'PERMISSION_TERDIR',
        caption: 'Тер.директор',
      },
      {
        id: 'PERMISSION_TARGETS_HEAD',
        caption: 'Управляющий КВ-АВ',
      },
    ];
  }

  public static baseChangePermit(): string {
    return 'PERMISSION_TARGETS_HEAD';
  }
}
