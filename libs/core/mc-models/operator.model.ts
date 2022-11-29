/* eslint-disable */
import { AccessGroup } from '@mc/core/mc-models/access-group.model';
import { UserMC } from './user-mc.model';
import { OperatorCode } from './operator-code.model';

export class Operator {
  id: number;
  pointId: number;
  status: string;
  anketStatus: string;
  statusShort: string;
  anketStatusShort: string;

  firstName: string;
  lastName: string;
  secondName: string;
  username: string;
  email: string;
  emailConfirmed: boolean;
  phone: string;
  mobilePhone: string;
  mobilePhoneConfirmed: boolean;
  description: string;
  extRef: string;

  needAnket: boolean;

  loginDate: string;
  loginMode: number;
  loginNum: number;
  password: string;
  passwordFilled: boolean;
  userAlias: string;

  agencyFeeAccount: string;
  agencyFeeDetailsLink: string;
  agencyFeeDetailsLinks: any[];
  agencyFeeAccountPassword: string;
  billingAccountId: number;

  allowPointChange: boolean;
  requestPointChange: boolean;

  accessControlGroups: AccessGroup[];
  callCenterExists: boolean;
  cardProcessAvailable: boolean;

  managerMC: UserMC;

  bankCodes: OperatorCode[];

  // joined fields
  partnerId: number;
  partnerCaption: string;
  companyId: number;
  companyCaption: string;
  pointCaption: string;

  createstamp: string;
  changestamp: string;

  public static getFieldNames() {
    return {
      firstName: 'Имя',
      lastName: 'Фамилия',
      secondName: 'Отчество',
      loginMode: 'Режим установки логина и пароля',
      loginNum: '№ конверта',
      loginDate: 'Дата последнего входа в систему',
      password: 'Пароль',
      username: 'Логин',
      userAlias: 'Пользователь взял логин',
      email: 'E-mail',
      phone: 'Старое поле телефон (доступно только в старом интерфейсе! в новом интерфейсе исправить не получится)',
      mobilePhone: 'Телефон мобильный',
      description: 'Комментарий',
      extRef: 'Внешний код',
      agencyFeeAccount: 'Аккаунт в системе SolarStaff',
      agencyFeeDetailsLink: 'Ссылка на страницу с расчетом вознаграждения',
      agencyFeeAccountPassword: 'Пароль для первого входа',
      allowPointChange: 'Единая учетка для многих торговых точек',
      requestPointChange: 'Запрашивать торговую точку при входе в систему',
      needAnket: 'Обязать оператора заполнить анкету',
    };
  }

  constructor(item) {
    this.id = item.id;
    this.pointId = item.pointId;
    this.status = item.status || null;
    this.anketStatus =
      item.anketStatus === null
        ? '-'
        : item.anketStatus
        ? item.anketStatus === 'new'
          ? 'начата'
          : 'готова'
        : undefined;

    this.loginMode = item.loginMode || 0;
    this.loginNum = item.loginNum ? +item.loginNum : null;
    this.password = item.password || null;
    this.passwordFilled = item.passwordFilled || null;

    this.firstName = item.firstName || '';
    this.lastName = item.lastName || '';
    this.secondName = item.secondName || null;
    this.username = item.username || null;
    this.userAlias = item.userAlias || null;
    this.email = item.email || null;
    this.phone = item.phone || null;
    this.mobilePhone = item.mobilePhone || null;
    this.description = item.description || null;
    this.extRef = item.extRef || null;
    this.loginDate = item.loginDate || null;
    this.allowPointChange = item.allowPointChange || null;
    this.requestPointChange = item.requestPointChange || null;

    if (item.managerMC) {
      this.managerMC = new UserMC(item.managerMC);
    }

    if (
      this.mobilePhone &&
      this.mobilePhone.length === 11 &&
      (this.mobilePhone[0] === '7' || this.mobilePhone[0] === '8')
    ) {
      this.mobilePhone = this.mobilePhone.substr(1);
    }

    this.bankCodes = item.bankCodes
      ? item.bankCodes.map(code => new OperatorCode({ ...code, operatorId: item.id }))
      : [];

    this.partnerId = item.partnerId || null;
    this.partnerCaption = item.partnerCaption || null;
    this.companyId = item.companyId || null;
    this.companyCaption = item.companyCaption || null;
    this.pointCaption = item.pointCaption || null;

    this.emailConfirmed = item.emailConfirmed || false;
    this.mobilePhoneConfirmed = item.mobilePhoneConfirmed || false;

    this.createstamp = item.createstamp;
    this.changestamp = item.changestamp;

    this.needAnket = item.needAnket;

    this.accessControlGroups = item.accessControlGroups
      ? item.accessControlGroups.map(elem => new AccessGroup(elem))
      : null;
    this.callCenterExists = item.callCenterExists;
    this.cardProcessAvailable = item.cardProcessAvailable;

    this.agencyFeeAccount = item.agencyFeeAccount || null;
    this.agencyFeeDetailsLink = item.agencyFeeDetailsLink || null;
    this.agencyFeeAccountPassword = item.agencyFeeAccountPassword || null;
    this.agencyFeeDetailsLinks = this.agencyFeeDetailsLink ? this.agencyFeeDetailsLink.split(' ') : [];
    this.agencyFeeDetailsLinks = this.agencyFeeDetailsLinks.map(link => {
      const arr = link.split('###');
      if (arr.length > 1) {
        while (arr[1].indexOf('_') > 0) {
          arr[1] = arr[1].replace('_', ' ');
        }
        return { url: arr[0], caption: arr[1] };
      }
      return { url: link, caption: link };
    });
    this.billingAccountId = item.billingAccountId || null;

    this.updateShortStatuses();
  }

  updateShortStatuses() {
    this.statusShort = '?';
    switch (this.status) {
      case 'new':
        this.statusShort = '-';
        break;
      case 'end':
        this.statusShort = 'V';
        break;
      case 'block':
        this.statusShort = 'B';
        break;
      case 'delete':
        this.statusShort = 'D';
        break;
    }
    this.anketStatusShort = '-';
    switch (this.anketStatus) {
      case 'начата':
        this.anketStatusShort = '+';
        break;
      case 'готова':
        this.anketStatusShort = 'V';
        break;
    }
  }

  get caption(): string {
    return this.getTitle();
  }

  getLastLogin() {
    if (this.loginDate) {
      const date = this.loginDate.slice(0, 10);
      const convertedDate = date.substr(8, 2) + '.' + date.substr(5, 2) + '.' + date.substr(0, 4);
      return convertedDate;
    } else {
      return null;
    }
  }

  getFillPercent() {
    const p1 = this.firstName ? 20 : 0;
    const p2 = this.lastName ? 20 : 0;
    const p3 = this.secondName ? 10 : 0;
    const p4 = this.username ? 20 : 0;
    const p5 = this.email ? 10 : 0;
    const p6 = this.mobilePhone ? 20 : 0;

    return p1 + p2 + p3 + p4 + p5 + p6;
  }

  getTitle(): string {
    return this.lastName + ' ' + this.firstName + (this.secondName === null ? '' : ' ' + this.secondName);
  }

  // tslint:disable-next-line:member-ordering
  static getEditRouteByIds(pointId: number, id: number, tab: string): any[] {
    return ['/backoffice/operators/edit', pointId, id, tab];
  }

  getEditRoute(): any[] {
    return Operator.getEditRouteByIds(this.pointId || 0, this.id, this.id ? 'summary' : 'account');
  }

  getEditRouteWithTab(tab: string): any[] {
    return Operator.getEditRouteByIds(this.pointId || 0, this.id, tab);
  }
}
