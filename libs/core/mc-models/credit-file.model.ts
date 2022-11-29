/* eslint-disable */
import { McUtils } from '../mc-utils';
import * as moment from 'moment-mini';
import { McFilterValue } from '@mc/common';

export class CreditFile {
  public static LOG_STATUS_PARTNER_POINT = 'PARTNER_POINT';
  public static LOG_STATUS_BANK_POINT = 'BANK_POINT';
  public static LOG_STATUS_BANK_TRANSIT = 'BANK_TRANSIT';
  public static LOG_STATUS_MC_POINT = 'MC_POINT';
  public static LOG_STATUS_MC_POINT_FOR_CHECK = 'MC_POINT_CHECK';
  public static LOG_STATUS_MC_POINT_WITH_ERRORS = 'MC_POINT_ERRORS';
  public static LOG_STATUS_MC_USER = 'MC_USER';
  public static LOG_STATUS_MC_TRANSIT = 'MC_TRANSIT';
  public static LOG_STATUS_BANK_UNKNOWN = 'BANK_UNKNOWN';
  public static LOG_STATUS_BANK_RECEIVED = 'BANK_RECEIVED';
  public static LOG_STATUS_BANK_ERROR = 'BANK_ERROR';
  public static LOG_STATUS_BANK_CRITICAL_ERROR = 'BANK_CRITICAL_ERROR';
  public static LOG_STATUS_BANK_ACCEPTED = 'BANK_ACCEPTED';

  public static SCANS_MC_STATUS_BAD = 'BAD';
  public static SCANS_MC_STATUS_GOOD = 'GOOD';
  public static SCANS_MC_STATUS_FOR_CHECK = 'FOR_CHECK';
  public static SCANS_MC_STATUS_BAD_BANK = 'BAD_BANK';
  public static SCANS_MC_STATUS_GOOD_BANK = 'GOOD_BANK';
  public static SCANS_MC_STATUS_FOR_CHECK_BANK = 'FOR_CHECK_BANK';

  public static docStatuses = {
    new: 'Ввод анкеты',
    send: 'Отправка в банки',
    wait_answer: 'Выбор предложения',
    contract: 'Подписание договора',
    end: 'Кредит выдан',
    cancel: 'Отменен',
    wait_docs: 'Создание документов',
    wait_docs_auto: 'Подготовка документов',
    pre_contract: 'Подготовка документов',
    online_form: 'Ввод анкеты онлайн',
    cc_new: 'Ввод анкеты для КЦ',
    cc_wait: 'Ожидание оператора КЦ',
    cc_work: 'Взята в работу оператором КЦ',
    cc_contract: 'Ожидание оператора ТТ',
    for_cancel: 'Регистрация отмены',
    for_sign_auto: 'Регистрация подписания',
    select_offer_auto: 'Регистрация выбора продукта',
    wait_answer_short: 'Выбор предложения',
    for_end: 'Регистрация выдачи',
    for_end_scans: 'Нет одобрения сканов',
  };

  id: number;
  active: boolean;
  wasActive: boolean;
  contractNumber: string;
  sesAgreementNumber: string;
  bankId: number;
  bankName: string;
  collectionPointCaption: string;
  collectionPointId: number;
  collectionPointResponsibleType: string;
  collectionPointResponsibleUserCaption: string;
  collectionPointResponsibleUsername: string;
  companyCaption: string;
  companyInn: string;
  companyId: number;
  createstamp: string;
  creditAmount: number;
  creditAmountForCompany: number;
  creditAmountForCompanyFormatted: string;
  creditDate: string;
  firstName: string;
  hubPointCaption: string;
  hubPointId: number;
  lastName: string;
  locationPointCaption: string;
  locationPointId: number;
  locationUser: string;
  locationUserFullname: string;
  logisticStatus: string;
  logisticStatusComment: string;
  logisticStatusChangeuserFullname: string;
  logisticStatusChangeuser: string;
  logisticStatusChangestamp: string;
  operatorFullname: string;
  operatorId: number;
  partnerCaption: string;
  partnerId: number;
  pointCaption: string;
  pointAddress: string;
  pointId: number;
  secondName: string;
  docStatus: string;
  metaOffer: any;

  creditDays: number;
  logStatusDays: number;
  logStatusDaysLimitStatus: number;
  logStatusDaysLimitCredit: number;
  logStatusWarningStatusText: string;
  logStatusWarningCreditText: string;

  logisticsKD: boolean;
  financingByScan: boolean;

  scansStatus: string;
  scansStatusChangestamp: string;
  scansStatusChangeuser: string;
  scansStatusChangeuserFullname: string;

  jointAccount: string;

  salesResponsibleUserFullname: string;
  salesResponsibleUsername: string;
  salesTerritoryHead = '';
  salesManager = '';
  salesGroup = '';

  scansStatusMcErrors = '';

  errorsInOriginal: any[];
  errorsInOriginalCompoundText: string;
  orderId: number;
  orderData?: any;
  responsibleCaption?: any;

  get creditDateDays(): string {
    if (!this.creditDate) {
      return '-';
    }
    const date = moment(this.creditDate, 'YYYY-MM-DD');
    const days = moment().diff(date, 'days');
    return days.toString();
  }

  get logisticStatusChangestampDays(): string {
    if (!this.logisticStatusChangestamp) {
      return '-';
    }
    const date = moment(this.logisticStatusChangestamp);
    const days = moment().diff(date, 'days');
    return days.toString();
  }

  get bankInsurance(): string {
    const meta = this.metaOffer;
    return meta ? (meta.insuranceLife || meta.insuranceUnemployment ? 'ДА' : '') : '?';
  }

  get fio(): string {
    return this.lastName + ' ' + this.firstName + ' ' + this.secondName;
  }

  get docStatusCaption(): string {
    if (this.active) {
      return 'авторизован';
    }
    if (this.wasActive) {
      return 'возвращен';
    }
    return 'не был авторизован';
  }

  get logisticStatusCaption() {
    return CreditFile.getLogisticStatusCaption(this.logisticStatus);
  }

  public static getLogisticStatusCaption(targetStatus: string): string {
    const status = CreditFile.getLogisticStatusVariants().find(item => targetStatus === item.id);

    return status ? status.caption : '';
  }

  public static getScansStatusCaption(targetStatus: string): string {
    const status = CreditFile.getScansStatusVariants().find(item => targetStatus === item.id);

    return status ? status.caption : '';
  }

  static getScansStatusVariants(): any[] {
    return [
      { id: CreditFile.SCANS_MC_STATUS_BAD, caption: 'Ошибки' },
      { id: CreditFile.SCANS_MC_STATUS_GOOD, caption: 'Приняты' },
      { id: CreditFile.SCANS_MC_STATUS_FOR_CHECK, caption: 'На проверку' },
      { id: CreditFile.SCANS_MC_STATUS_BAD_BANK, caption: 'Ошибки (банк)' },
      { id: CreditFile.SCANS_MC_STATUS_GOOD_BANK, caption: 'Приняты (банк)' },
      { id: CreditFile.SCANS_MC_STATUS_FOR_CHECK_BANK, caption: 'На проверку (банк)' },
    ];
  }

  static getLogisticStatusVariants(): any[] {
    return [
      { id: CreditFile.LOG_STATUS_PARTNER_POINT, caption: 'Партнер' },
      { id: CreditFile.LOG_STATUS_MC_USER, caption: 'Менеджер' },
      { id: CreditFile.LOG_STATUS_MC_TRANSIT, caption: 'ТК в ХАБ' },
      { id: CreditFile.LOG_STATUS_MC_POINT_FOR_CHECK, caption: 'ХАБ (на проверку)' },
      { id: CreditFile.LOG_STATUS_MC_POINT_WITH_ERRORS, caption: 'ХАБ (КД с ошибками)' },
      { id: CreditFile.LOG_STATUS_MC_POINT, caption: 'ХАБ (КД принято' },
      { id: CreditFile.LOG_STATUS_BANK_TRANSIT, caption: 'ТК в банк' },
      { id: CreditFile.LOG_STATUS_BANK_POINT, caption: 'Банк (курьер сдал)' },
      { id: CreditFile.LOG_STATUS_BANK_RECEIVED, caption: 'Банк (в рассм.)' },
      { id: CreditFile.LOG_STATUS_BANK_CRITICAL_ERROR, caption: 'Банк (крит. ошибки)' },
      { id: CreditFile.LOG_STATUS_BANK_ERROR, caption: 'Банк (принято с ошибками)' },
      { id: CreditFile.LOG_STATUS_BANK_ACCEPTED, caption: 'Банк (принято)' },
      { id: CreditFile.LOG_STATUS_BANK_UNKNOWN, caption: 'Банк (???)' },
    ];
  }

  static getLogisticStatusFilterVariants(): McFilterValue[] {
    return [
      { value: 'PARTNER_POINT', caption: 'Партнер' },
      { value: 'MC_USER', caption: 'Менеджер' },
      { value: 'MC_TRANSIT', caption: 'ТК в ХАБ' },
      { value: 'MC_POINT_CHECK', caption: 'ХАБ (на проверку)' },
      { value: 'MC_POINT_ERRORS', caption: 'ХАБ (КД с ошибками)' },
      { value: 'MC_POINT', caption: 'ХАБ (КД принято' },
      { value: 'BANK_TRANSIT', caption: 'ТК в банк' },
      { value: 'BANK_POINT', caption: 'Банк (курьер сдал)' },
      { value: 'BANK_RECEIVED', caption: 'Банк (в рассм.)' },
      { value: 'BANK_CRITICAL_ERROR', caption: 'Банк (крит. ошибки)' },
      { value: 'BANK_ERROR', caption: 'Банк (принято с ошибками)' },
      { value: 'BANK_ACCEPTED', caption: 'Банк (принято)' },
      { value: 'BANK_UNKNOWN', caption: 'Банк (???)' },
    ];
  }

  constructor(item) {
    this.id = item.id;
    this.active = item.active;
    this.wasActive = item.wasActive;
    this.docStatus = item.docStatus;
    this.contractNumber = item.contractNumber;
    this.sesAgreementNumber = item.sesAgreementNumber;

    this.logisticStatusChangestamp = item.logisticStatusChangestamp
      ? (item.logisticStatusChangestamp as string).replace('T', ' ')
      : '';
    this.logisticStatusChangeuserFullname = item.logisticStatusChangeuserFullname || 'Система';
    this.logisticStatusChangeuser = item.logisticStatusChangeuser || '';

    this.logisticsKD = item.logisticsKD;
    this.financingByScan = item.financingByScan;

    this.scansStatus = item.attachmentsStatus;
    this.scansStatusChangestamp = item.attachmentsStatusChangestamp
      ? (item.attachmentsStatusChangestamp as string).replace('T', ' ')
      : null;
    this.scansStatusChangeuser = item.attachmentsStatusChangeuser;
    this.scansStatusChangeuserFullname = item.attachmentsStatusChangeuserFullname;

    this.metaOffer = item.metaOffer;

    this.creditAmount = item.creditAmount;
    this.creditAmountForCompany = item.metaOffer ? item.metaOffer.creditAmountForCompany : null;
    this.creditAmountForCompanyFormatted = this.creditAmountForCompany
      ? McUtils.formatSumm(this.creditAmountForCompany, 2)
      : null;
    this.creditDate = item.creditDate;
    this.createstamp = item.createstamp;

    this.collectionPointCaption = item.collectionPointCaption;
    this.collectionPointId = item.collectionPointId;
    this.collectionPointResponsibleType = item.collectionPointResponsibleType;
    this.collectionPointResponsibleUserCaption = item.collectionPointResponsibleUserCaption;
    this.collectionPointResponsibleUsername = item.collectionPointResponsibleUsername;

    this.bankId = item.bankId;
    this.bankName = item.bankName;

    this.collectionPointCaption = item.collectionPointCaption;
    this.collectionPointId = item.collectionPointId;

    this.firstName = item.firstName;
    this.lastName = item.lastName;
    this.secondName = item.secondName;

    this.partnerId = item.partnerId;
    this.partnerCaption = item.partnerCaption;
    this.companyId = item.companyId;
    this.companyCaption = item.companyCaption;
    this.pointId = item.pointId;
    this.pointCaption = item.pointCaption;
    this.operatorId = item.operatorId;
    this.operatorFullname = item.operatorFullname;

    this.logisticStatus = item.logisticStatus; // || CreditFile.LOG_STATUS_PARTNER_POINT;
    this.logisticStatusComment = item.logisticStatusComment;
    this.locationPointId = item.locationPointId;
    this.locationPointCaption = item.locationPointCaption;
    this.locationUser = item.locationUser;
    this.locationUserFullname = item.locationUserFullname;
    this.hubPointId = item.hubPointId;
    this.hubPointCaption = item.hubPointCaption;

    this.errorsInOriginal = item.errorsInOriginal;
    this.orderId = item.orderId;
    this.orderData = {
      SES: '?',
      jointAccount: '?',
      bankInsurance: '?',
    };
    this.salesResponsibleUserFullname = item.salesResponsibleUserFullname;
    this.salesResponsibleUsername = item.salesResponsibleUsername;
  }

  public logisticsStatusUpdateError(newStatus: string): string {
    if (!this.logisticStatus) {
      return null;
    }
    const statusVariants = CreditFile.getLogisticStatusVariants();
    const currentStatusCaption = CreditFile.getLogisticStatusCaption(this.logisticStatus);
    const newStatusCaption = CreditFile.getLogisticStatusCaption(newStatus);
    const currentStatusIndex = statusVariants.findIndex(item => item.id === this.logisticStatus);
    const newStatusIndex = statusVariants.findIndex(item => item.id === newStatus);
    if (newStatusIndex < currentStatusIndex) {
      return (
        'КД №' +
        this.id +
        ' - нет прав назначить предыдущий статус <' +
        newStatusCaption +
        '> (сейчас <' +
        currentStatusCaption +
        '>)'
      );
    }
    return null;
  }

  public logisticStatusIsLaterThenCurrent(targetStatus: string): boolean {
    const targetStatusIndex = CreditFile.getLogisticStatusVariants().findIndex(variant => variant.id === targetStatus);
    const curentStatusIndex = CreditFile.getLogisticStatusVariants().findIndex(
      variant => variant.id === this.logisticStatus,
    );

    return targetStatusIndex > curentStatusIndex;
  }

  get scansStatusCaption(): string {
    let res = '?(' + this.scansStatus + ')';
    CreditFile.getScansStatusVariants().forEach(elem => {
      if (elem.id === this.scansStatus) {
        res = elem.caption;
      }
    });
    return res;
  }

  get locationCaption(): string {
    if (this.logisticStatus === 'MC_USER' && this.locationUserFullname) {
      return this.locationUserFullname;
    } else {
      return this.locationPointCaption || this.pointCaption;
    }
  }

  get locationTypeCaption(): string {
    const logStatus = CreditFile.getLogisticStatusVariants().find(item => item.id === this.logisticStatus);
    return logStatus ? logStatus.caption : '? (' + this.logisticStatus + ')';
  }
}
