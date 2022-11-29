/* eslint-disable */
import { McUtils } from '../mc-utils';
import { CompanyBankParams } from './company-bank-params.model';
import { CompanyBankAccount } from './company-bank-account.model';
import { KladrAddress } from './kladr-address.model';

export class Company {
  private static finPropList = [
    'inn',
    'kpp',
    'egrulShortName',
    'egrulLegalName',
    'bankBic',
    'bankName',
    'bankCorrespondentAccount',
    'bankCurrentAccount',
    'authorizedForeignPassport',
    'authorizedForeignPassportCitizenship',
    'authorizedForeignPassportNumber',
    'authorizedForeignPassportSeries',
    'authorizedForeignPassportValidity',
  ];

  id: number;
  partnerId: number;
  status: string;
  infoStatusId: number;
  infoStatusCaption: string;

  crmProperties: string;
  crmSettings: any;
  finProperties: string;

  finPropertiesApprovedBy: string;
  finPropertiesApprovedStamp: string;

  kladrEgrulAddress: KladrAddress;

  // common
  inn: string;
  code: string;
  kpp: string;
  caption: string;
  description: string;
  taxSystem: string;
  businessAddress: string;
  address: string;
  // bank account
  bankBic: string;
  bankName: string;
  bankCorrespondentAccount: string;
  bankCurrentAccount: string;

  // bank accounts
  bankAccountsByPoints: boolean;
  bankAccounts: CompanyBankAccount[];

  // contract signer
  authorizedContactFullname: string;
  authorizedContactPhone: string;
  authorizedContactReason: string;
  authorizedContactLA: string;

  authorizedContactEmail: string;
  authorizedContactBirthday: string;
  authorizedContactBirthplace: string;
  authorizedContactFactAddr: string;
  authorizedContactRegAddr: string;
  authorizedPassportIssueDate: string;
  authorizedPassportIssuer: string;
  authorizedPassportIssuerCode: string;
  authorizedPassportNumber: string;
  authorizedPassportSeries: string;
  authorizedForeignPassport: boolean;
  authorizedForeignPassportCitizenship: string;
  authorizedForeignPassportNumber: string;
  authorizedForeignPassportSeries: string;
  authorizedForeignPassportValidity: string;

  // egrul imported
  egrulShortName: string;
  egrulLegalName: string;
  egrulLegalForm: string;
  egrulLegalAddress: string;
  egrulAuthorizedPersonFullname: string;
  egrulAuthorizedPersonPosition: string;

  egrulOgrn: string;
  egrulRegNumber: string;
  egrulRegDate: string;
  egrulRegIssuer: string;
  egrulRegPlace: string;
  egrulOkpo: string;
  egrulOkato: string;

  // joined fields
  partnerCaption: string;

  accessControlGroups: any;
  salesAccessGroup: string;

  bankParams: CompanyBankParams[];

  allAccessControlGroups: any;

  public static getReasons(): string[] {
    return ['Свидетельство', 'Устав', 'Доверенность'];
  }

  public static getFieldNamesSplittedByFormParts(): any[] {
    return [
      {
        '*sectionTitle': 'Общая информация',
        caption: 'Наименование',
        description: 'Комментарий',
        inn: 'ИНН',
        code: 'ИНН',
        egrulOgrn: 'ОГРН',
        kpp: 'КПП',
        taxSystem: 'Система налогообложения',
        businessAddress: 'Фактический адрес',
      },
      {
        '*sectionTitle': 'Банковские реквизиты',
        bankName: 'Наименование банка',
        bankBic: 'БИК',
        bankCorrespondentAccount: 'Номер к/с банка',
        bankCurrentAccount: 'Номер р/с компании',
      },
      {
        '*sectionTitle': 'Кто подписывает договор',
        authorizedContactFullname: 'ФИО',
        authorizedContactPhone: 'Телефон',
        authorizedContactEmail: 'E-mail',
        authorizedContactReason: 'Основания его полномочий',
        authorizedContactLA: 'Серия, номер и дата выдачи доверенности (если по доверенности)',
        authorizedContactFactAddr: 'Адрес проживания (почтовый)',

        authorizedContactBirthday: 'Дата рождения',
        authorizedContactBirthplace: 'Место рождения',
        authorizedContactRegAddr: 'Адрес регистрации',
        authorizedPassportIssueDate: 'Дата выдачи',
        authorizedPassportIssuer: 'Кем выдан',
        authorizedPassportIssuerCode: 'Код подразделения',
        authorizedPassportNumber: 'Номер паспорта',
        authorizedPassportSeries: 'Серия паспорта',

        authorizedForeignPassportCitizenship: 'Гражданство',
        authorizedForeignPassportNumber: 'Номер паспорта',
        authorizedForeignPassportSeries: 'Серия паспорта',
        authorizedForeignPassportValidity: 'Срок действия',
      },
      {
        '*sectionTitle': 'Сведения из ЕГРЮЛ',
        egrulShortName: 'Краткое наименование',
        egrulLegalName: 'Полное наименование',
        egrulLegalForm: 'Организационно-правовая форма',
        egrulLegalAddress: 'Юридический адрес',
        egrulAuthorizedPersonFullname: 'ФИО лица, с правом действия без доверенности',
        egrulAuthorizedPersonPosition: 'Должность лица, с правом действия без доверенности',
      },
      {
        '*sectionTitle': 'Сведения о регистрации',
        egrulOgrn: 'ОГРН',
        egrulRegNumber: 'Серия и номер свидетельства',
        egrulRegDate: 'Дата регистрации',
        egrulRegIssuer: 'Наименование регистрирующего органа',
        egrulRegPlace: 'Место регистрации',
        egrulOkpo: 'ОКПО',
        egrulOkato: 'ОКАТО',
        egrulOkved: 'ОКВЭД',
      },
    ];
  }

  constructor(item) {
    this.id = item.id;
    this.partnerId = item.partnerId;
    this.status = item.status || null;
    this.infoStatusId = item.infoStatusId || null;

    this.crmProperties = item.crmProperties || null;
    this.crmSettings = item.crmSettings || {};
    this.finProperties = item.finProperties || null;
    this.finPropertiesApprovedStamp = item.finChangestamp ? item.finChangestamp.replace('T', ' в ').slice(0, 21) : null;

    this.caption = item.caption || '';
    this.inn = item.inn || '';
    this.code = item.code || '';
    this.kpp = item.kpp || null;
    this.description = item.description || null;
    this.taxSystem = item.taxSystem || null;
    this.businessAddress = item.businessAddress || null;
    this.address = item.address || null;
    this.bankBic = item.bankBic || null;
    this.bankName = item.bankName || null;
    this.bankCorrespondentAccount = item.bankCorrespondentAccount || null;
    this.bankCurrentAccount = item.bankCurrentAccount || null;

    this.authorizedContactFullname = item.authorizedContactFullname || null;
    this.authorizedContactPhone = item.authorizedContactPhone || null;
    this.authorizedContactReason = item.authorizedContactReason || null;
    this.authorizedContactLA = item.authorizedContactLA || null;

    this.authorizedContactEmail = item.authorizedContactEmail || null;
    this.authorizedContactBirthday = item.authorizedContactBirthday || null;
    this.authorizedContactBirthplace = item.authorizedContactBirthplace || null;
    this.authorizedContactFactAddr = item.authorizedContactFactAddr || null;
    this.authorizedContactRegAddr = item.authorizedContactRegAddr || null;
    this.authorizedPassportIssueDate = item.authorizedPassportIssueDate || null;
    this.authorizedPassportIssuer = item.authorizedPassportIssuer || null;
    this.authorizedPassportIssuerCode = item.authorizedPassportIssuerCode || null;
    this.authorizedPassportNumber = item.authorizedPassportNumber || null;
    this.authorizedPassportSeries = item.authorizedPassportSeries || null;
    this.authorizedForeignPassport = item.authorizedForeignPassport || false;
    this.authorizedForeignPassportCitizenship = item.authorizedForeignPassportCitizenship || null;
    this.authorizedForeignPassportNumber = item.authorizedForeignPassportNumber || null;
    this.authorizedForeignPassportSeries = item.authorizedForeignPassportSeries || null;
    this.authorizedForeignPassportValidity = item.authorizedForeignPassportValidity || null;

    this.egrulShortName = item.egrulShortName || null;
    this.egrulLegalName = item.egrulLegalName || null;
    this.egrulLegalForm = item.egrulLegalForm || null;
    this.egrulLegalAddress = item.egrulLegalAddress || null;
    this.egrulAuthorizedPersonFullname = item.egrulAuthorizedPersonFullname || null;
    this.egrulAuthorizedPersonPosition = item.egrulAuthorizedPersonPosition || null;

    this.egrulOgrn = item.egrulOgrn || null;
    this.egrulRegNumber = item.egrulRegNumber || null;
    this.egrulRegDate = item.egrulRegDate || null;
    this.egrulRegIssuer = item.egrulRegIssuer || null;
    this.egrulRegPlace = item.egrulRegPlace || null;
    this.egrulOkpo = item.egrulOkpo || null;
    this.egrulOkato = item.egrulOkato || null;

    this.partnerCaption = item.partnerCaption || null;
    this.infoStatusCaption = item.infoStatusCaption || '';

    this.accessControlGroups = item.accessControlGroups ? item.accessControlGroups.filter(elem => elem.owner) : [];
    this.salesAccessGroup = McUtils.getAccessGroupTitle(this.accessControlGroups, 'sales');
    this.bankParams = item.bankParams ? item.bankParams.map(elem => new CompanyBankParams(elem)) : [];
    this.bankParams = this.bankParams.filter(param => param.status !== 'delete');

    this.allAccessControlGroups = item.accessControlGroups || [];

    this.decodeJsonProperties();
  }

  encodeJsonProperties(approver: string): string {
    const info: any = {
      bankAccounts: this.bankAccounts,
      bankAccountsByPoints: this.bankAccountsByPoints,
    };

    Company.finPropList.forEach(prop => {
      info[prop] = this[prop];
    });

    if (approver) {
      info.approvedBy = approver;
      info.approvedStamp = new Date().toISOString();
    }

    return JSON.stringify(info);
  }

  decodeJsonProperties() {
    if (this.crmProperties) {
      try {
        const crmProperties = JSON.parse(this.crmProperties);
        this.bankAccounts = crmProperties.bankAccounts
          ? crmProperties.bankAccounts.map(elem => new CompanyBankAccount(elem))
          : [];
        this.bankAccountsByPoints = crmProperties.bankAccountsByPoints || false;
        this.authorizedForeignPassport = crmProperties.authorizedForeignPassport || false;
        this.authorizedForeignPassportCitizenship = crmProperties.authorizedForeignPassportCitizenship || null;
        this.authorizedForeignPassportNumber = crmProperties.authorizedForeignPassportNumber || null;
        this.authorizedForeignPassportSeries = crmProperties.authorizedForeignPassportSeries || null;
        this.authorizedForeignPassportValidity = crmProperties.authorizedForeignPassportValidity || null;
      } catch (error) {}
    }
  }

  getAuthorizationCaptionForStatus(status: string) {
    return {
      wait: 'Новое',
      bank_work: 'Взято в работу',
      end: 'Готово',
      wait_add: 'Доавторизация',
    }[status];
  }

  getAccessGroup(type: 'sales' | 'backoffice') {
    return this.accessControlGroups.find(item => item.accessRole === type);
  }

  getPercentPart1() {
    const capDone = this.caption ? 25 : 0;
    const innDone = this.inn ? 25 : 0;
    const adrDone = this.businessAddress ? 25 : 0;
    const ogrnDone = this.egrulOgrn ? 25 : 0;
    return innDone + ogrnDone + adrDone + capDone;
  }

  getPercentPart2() {
    const bicDone = this.bankBic ? 25 : 0;
    const bnDone = this.bankName ? 25 : 0;
    const rsDone = this.bankCorrespondentAccount ? 25 : 0;
    const ksDone = this.bankCurrentAccount ? 25 : 0;
    return bicDone + bnDone + rsDone + ksDone;
  }

  getPercentPart3() {
    const fnDone = this.authorizedContactFullname ? 15 : 0;
    const phDone = this.authorizedContactPhone ? 15 : 0;
    const reDone = this.authorizedContactReason ? 15 : 0;
    const laDone =
      this.authorizedContactReason === 'Свидетельство' ||
      this.authorizedContactReason === 'Устав' ||
      this.authorizedContactLA
        ? 15
        : 0;

    const part0 = this.authorizedContactBirthday ? 5 : 0;
    const part1 = this.authorizedContactBirthplace ? 5 : 0;
    const part2 = this.authorizedContactRegAddr ? 5 : 0;
    const part3 = this.authorizedPassportIssueDate ? 5 : 0;
    const part4 = this.authorizedPassportIssuer ? 5 : 0;
    const part5 = this.authorizedPassportIssuerCode ? 5 : 0;
    const part6 = this.authorizedPassportNumber ? 5 : 0;
    const part7 = this.authorizedPassportSeries ? 5 : 0;

    const parts = part0 + part1 + part2 + part3 + part4 + part5 + part6 + part7;

    return fnDone + phDone + reDone + laDone + parts;
  }

  getPercentPart4() {
    const snDone = this.egrulShortName ? 15 : 0;
    const fnDone = this.egrulLegalName ? 20 : 0;
    const opfDone = this.egrulLegalForm ? 15 : 0;
    const adrDone = this.egrulLegalAddress ? 20 : 0;
    const aFioDone = this.egrulAuthorizedPersonFullname ? 15 : 0;
    const aPosDone = this.egrulAuthorizedPersonPosition ? 15 : 0;
    return snDone + fnDone + opfDone + adrDone + aFioDone + aPosDone;
  }

  getPercentPart5() {
    const d1 = this.egrulOgrn ? 25 : 0;
    const d2 = this.egrulRegNumber ? 25 : 0;
    const d3 = this.egrulRegDate ? 25 : 0;
    const d4 = this.egrulRegIssuer ? 25 : 0;
    // const d5 = this.egrulRegPlace ? 20 : 0;
    // const d6 = this.egrulOkpo ? 10 : 0;
    // const d7 = this.egrulOkato ? 10 : 0;
    return d1 + d2 + d3 + d4;
  }

  getFillPercent() {
    return (this.getPercentPart1() + this.getPercentPart2() + this.getPercentPart3() + this.getPercentPart4()) / 4;
  }

  getTitle(): string {
    return this.caption;
  }

  // tslint:disable-next-line:member-ordering
  static getEditRouteByIds(partnerId: number, id: number, tab: string): any[] {
    return ['/backoffice/companies/edit', partnerId, id, tab];
  }

  getEditRoute(tab?: string): any[] {
    return Company.getEditRouteByIds(
      this.partnerId || 0,
      this.id,
      tab === undefined ? (this.id ? 'summary' : 'form') : tab,
    );
  }

  getTypedTitle(): string {
    return this.getTitle();
  }
}
