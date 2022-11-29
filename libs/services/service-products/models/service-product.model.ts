/* eslint-disable */
export class ServiceProduct {
  id: number;

  code: string;
  caption: string;
  description: string;
  installments: boolean;
  reservMethod: 'INTERNAL' | 'EXTERNAL' | 'BANK';

  brandCaption: string;
  brandId: number;
  goodCaption: string;
  goodId: number;
  companyCaption: string;
  companyId: number;
  typeCaption: string;
  typeId: number;

  amountRule: number;
  baseAmount: number;
  baseRate: number;

  extensionAmountRule: number;
  baseExtensionAmount: number;
  baseExtRate: number;

  beginStampRule: number;
  baseBeginValue: number;

  endStampRule: number;
  baseEndValue: number;

  jointAccountEnabled: boolean;

  providerCompanyCaption: string;
  providerCompanyId: number;
  integrationCaption: string;
  bankId: number;
  seriesStrategy: string;

  templateType: 'html' | null;
  templateInfo: TemplateInfo;

  scriptSettings: any;
  scriptPluginSettings: any;

  scanSettings: ServiceProductScanSetting[];

  public static getAmountRuleVariants() {
    return [
      {
        value: 1,
        label: 'Фиксированная сумма',
      },
      {
        value: 2,
        label: 'Процент от суммы кредита',
      },
      {
        value: 3,
        label: 'Ежемесячный платёж',
      },
      {
        value: 4,
        label: 'Скрипт',
      },
      {
        value: 5,
        label: 'Скрипт-плагин',
      },
    ];
  }

  public static getExtensionAmountRuleVariants() {
    return [
      {
        value: 1,
        label: 'Фиксированная сумма',
      },
      {
        value: 2,
        label: 'Процент от базы',
      },
    ];
  }

  public static getReservMethodVariants() {
    return [
      {
        value: 'INTERNAL',
        label: 'Внутренний',
      },
      {
        value: 'EXTERNAL',
        label: 'Внешний',
      },
      {
        value: 'BANK',
        label: 'Банк',
      },
    ];
  }

  public static getBeginStampRuleVariants() {
    return [
      {
        value: 1,
        label: 'Дата оформления кредита',
      },
      {
        value: 2,
        label: 'Дней от даты оформления кредита',
      },
    ];
  }

  public static getEndStampRuleVariants() {
    return [
      {
        value: 1,
        label: 'Фиксировано (месяц)',
      },
      {
        value: 2,
        label: 'Фиксировано (календарных дней)',
      },
      {
        value: 3,
        label: 'Дата окончания кредита',
      },
    ];
  }

  public static getSeriesStrategyVariants() {
    return [
      {
        value: 'none',
        label: 'Не использовать',
      },
      {
        value: 'pregenerated',
        label: 'Предварительно сформированные (По-умолчанию)',
      },
    ];
  }

  public static getFieldNames() {
    return {
      code: 'Код',
      caption: 'Наименование',
      description: 'Описание',
      installments: 'Допустима рассрочка',
      reservMethod: 'Метод резервирования',

      brandId: 'Производитель (для передачи в банк)',
      goodId: 'Товар (для передачи в банк)',
      companyId: 'Организация, предоставляющая доп.услугу',
      typeId: 'Тип продукта',

      amountRule: 'Правило цены',
      baseAmount: 'Фиксированная сумма',
      baseRate: 'Тариф (Процент от суммы кредита)',
      amountRuleScriptSettings: 'Тариф (Процент от суммы кредита)',

      extensionAmountRule: 'Правило доп.суммы',
      baseExtensionAmount: 'Фиксированная доп.сумма',
      baseExtRate: 'Страховое покрытие (Процент от базы)',

      beginStampRule: 'Правило даты начала действия',
      baseBeginValue: 'Значение даты начала действия',

      endStampRule: 'Правило даты окончания действия',
      baseEndValue: 'Значение даты окончания действия',

      jointAccountEnabled: 'Номинальный счёт',
      providerCompanyId: 'Провайдер услуги',
      bankId: 'Интеграция с банком',
      seriesStrategy: 'Номерные серии',

      templateType: 'Использовать шаблон печатной формы',
    };
  }

  public static getScanFieldNames() {
    return {
      scanCode: 'Код',
      scanCaption: 'Наименование',
    };
  }

  constructor(item) {
    this.id = item.id;

    this.code = item.code || '';
    this.caption = item.caption || '';
    this.description = item.description || '';
    this.installments = !!item.installments;
    this.reservMethod = item.reservMethod || 'INTERNAL';

    this.brandCaption = item.brandCaption || '';
    this.brandId = item.brandId || null;
    this.companyCaption = item.companyCaption || '';
    this.companyId = item.companyId || null;
    this.goodCaption = item.goodCaption || '';
    this.goodId = item.goodId || null;
    this.typeCaption = item.typeCaption || '';
    this.typeId = item.typeId || null;

    this.amountRule = item.amountRule || 1;
    this.baseAmount = item.baseAmount || null;
    this.baseRate = item.baseRate || null;

    this.extensionAmountRule = item.extensionAmountRule || 1;
    this.baseExtensionAmount = item.baseExtensionAmount || null;
    this.baseExtRate = item.baseExtRate || null;

    this.beginStampRule = item.beginStampRule || 1;
    this.baseBeginValue = item.baseBeginValue || null;

    this.endStampRule = item.endStampRule || 1;
    this.baseEndValue = item.baseEndValue || null;

    this.jointAccountEnabled = item.jointAccountEnabled || null;

    this.providerCompanyCaption = item.providerCompanyCaption || '';
    this.providerCompanyId = item.providerCompanyId || null;
    this.integrationCaption = item.integrationCaption || '';
    this.bankId = item.bankId || null;
    this.seriesStrategy = item.seriesStrategy || null;

    this.scriptSettings = item.scriptSettings;
    this.scriptPluginSettings = new ScriptPluginSettings(item.scriptPluginSettings || {});

    this.templateType = item.templateType || null;
    this.templateInfo = item.templateInfo || null;
    this.scanSettings = item.scanSettings || [];
  }

  getTitle(): string {
    return this.caption;
  }

  // tslint:disable-next-line:member-ordering
  static getEditRouteByIds(id: number): any[] {
    return ['/service-products/items', id];
  }

  getEditRoute(): any[] {
    return ServiceProduct.getEditRouteByIds(this.id);
  }

  getCopyRoute(): any[] {
    return ['/service-products/items', 0, this.id];
  }
}

export interface TemplateInfo {
  createstamp: string;
  createuser: string;
  filename: string;
}

export class ScriptPluginSettings {
  plugins: any;
  settings: any;
  bankSettings: any;

  constructor(item) {
    this.plugins = item.plugins || {};
    this.settings = item.settings || {};
    this.bankSettings = item.bankSettings || {};
  }
}

export interface ServiceProductScanSetting {
  scanCode: string;
  scanCaption: string;
}
