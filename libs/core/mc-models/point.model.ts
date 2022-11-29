/* eslint-disable */
import { McUtils } from '../mc-utils';
import { KladrAddress } from './kladr-address.model';
import { PointCode } from './point-code.model';

export class Point {
  id: number;
  code: string;
  description: string;
  companyId: number;
  status: string;
  infoStatusId: number;
  infoStatusCaption: string;
  active: boolean;

  createstamp: string;
  changestamp: string;
  crmSettings: any;

  accessControlGroups: any;
  salesAccessGroup: string;

  caption: string;
  partnerProfileId: number;
  address: string;
  phone: string;
  workingHours: string;
  housing: string;
  territoryId: number;
  shopName: string;
  marketId: number;
  marketCaption: string;

  bankCodes: PointCode[];

  pointAddress: KladrAddress;

  managerContactFullname: string;
  managerContactPhone: string;
  managerContactEmail: string;

  // joined fields
  partnerId: number;
  partnerCaption: string;
  companyCaption: string;
  territoryCaption: string;

  public static getFieldNamesSplittedByFormParts(): any[] {
    const pointAddressFieldNames: any = {
      '*sectionTitle': 'КЛАДР-адрес',
    };
    const kladrFieldNames = KladrAddress.getFieldNames();

    // tslint:disable-next-line:forin
    for (const fieldName in kladrFieldNames) {
      pointAddressFieldNames['pointAddress.' + fieldName] = kladrFieldNames[fieldName];
    }

    const fieldNames = [
      {
        '*sectionTitle': 'Общая информация',
        code: 'Код',
        caption: 'Наименование',
        description: 'Комментарий',
        partnerProfileId: 'Профиль деятельности партнера',
        address: 'Адрес',
        housing: 'Право пользования помещением',
        phone: 'Телефон',
        workingHours: 'Часы работы',
        territoryId: 'Территория',
        shopName: 'Вывеска',
        marketId: 'Рынок',
      },
      {
        '*sectionTitle': 'Руководитель торговой точки',
        managerContactFullname: 'ФИО руководителя',
        managerContactPhone: 'Телефон',
        managerContactEmail: 'E-mail',
      },
      pointAddressFieldNames,
    ];
    return fieldNames;
  }

  constructor(item) {
    this.id = item.id;
    this.code = item.code || null;
    this.companyId = item.companyId;
    this.status = item.status || null;
    this.infoStatusId = item.infoStatusId || null;
    this.active = item.active;

    this.createstamp = item.createstamp;
    this.changestamp = item.changestamp;
    this.crmSettings = item.crmSettings || null;

    this.caption = item.caption || '';
    this.description = item.description || null;
    this.partnerProfileId = item.partnerProfileId || 0;
    this.territoryId = item.territoryId || null;
    this.address = item.address || null;
    this.phone = item.phone || null;
    this.workingHours = item.workingHours || null;
    this.housing = item.housing || null;

    this.bankCodes = item.bankCodes ? item.bankCodes.map(code => new PointCode({ ...code, pointId: item.id })) : [];

    this.managerContactFullname = item.managerContactFullname || null;
    this.managerContactPhone = item.managerContactPhone || null;
    this.managerContactEmail = item.managerContactEmail || null;

    this.partnerId = item.partnerId || null;
    this.partnerCaption = item.partnerCaption || null;
    this.companyCaption = item.companyCaption || null;
    this.infoStatusCaption = item.infoStatusCaption || '';
    this.territoryCaption = item.territoryCaption || '';

    this.accessControlGroups = item.accessControlGroups ? item.accessControlGroups.filter(elem => elem.owner) : [];
    this.salesAccessGroup = McUtils.getAccessGroupTitle(this.accessControlGroups, 'sales');
    this.pointAddress = new KladrAddress(item.pointAddress);
    this.shopName = item.shopName || null;
    this.marketId = item.marketId || null;
    this.marketCaption = item.marketCaption || null;

    if (this.crmSettings) {
      this.shopName = this.crmSettings.shopName || null;
      this.marketId = this.crmSettings.marketId || null;
      this.marketCaption = this.crmSettings.marketCaption || null;
      this.phone = this.crmSettings.phone || null;
      this.workingHours = this.crmSettings.workingHours || null;
      this.housing = this.crmSettings.housing || null;
      this.managerContactFullname = this.crmSettings.managerContactFullName || null;
      this.managerContactPhone = this.crmSettings.managerContactPhone || null;
      this.managerContactEmail = this.crmSettings.managerContactEmail || null;
    }
  }

  updateTownFromAddressString() {
    this.updateTownFromAddressStringByType(' г ');
    this.updateTownFromAddressStringByType(' село ');
    this.updateTownFromAddressStringByType(' пгт ');
    this.updateTownFromAddressStringByType(' поселок ');
    this.updateTownFromAddressStringByType(' деревня ');
    this.updateTownFromAddressStringByType(' ст-ца ');
  }

  updateTownFromAddressStringByType(type: string) {
    let town = null;
    const townFrom = this.address.indexOf(type);
    if (townFrom > 0) {
      town = this.address.slice(townFrom + 1);
      const townTo = town.indexOf(',');
      if (townTo > 0) {
        town = town.slice(0, townTo);
      }
    }
    if (!this.pointAddress?.town && !this.pointAddress?.locality && town) {
      this.pointAddress = new KladrAddress({ town: town });
    }
  }

  getAccessGroup(type: 'sales' | 'backoffice') {
    return this.accessControlGroups.find(item => item.accessRole === type);
  }

  getFillPercent() {
    const p1 = this.caption ? 20 : 0;
    const p2 = this.partnerProfileId ? 10 : 0;
    const p3 = this.address ? 10 : 0;
    const p4 = this.phone ? 10 : 0;
    const p5 = this.workingHours ? 10 : 0;
    const p6 = this.housing ? 10 : 0;

    const c1a = this.managerContactFullname ? 10 : 0;
    const c1b = this.managerContactPhone ? 10 : 0;
    const c1c = this.managerContactEmail ? 10 : 0;

    return p1 + p2 + p3 + p4 + p5 + p6 + c1a + c1b + c1c;
  }

  getShortAddressForCaption() {
    let fullAddress = this.address;
    if (!fullAddress) {
      return '';
    }

    if (fullAddress.indexOf('; ') > 0) {
      return fullAddress.slice(fullAddress.indexOf('; ') + 2);
    } else if (this.pointAddress) {
      return this.pointAddress.getAddressFromCity();
    }
    let firstChar = fullAddress.slice(0, 1);
    while (fullAddress.length && firstChar >= '0' && firstChar <= '9') {
      fullAddress = fullAddress.substr(1);
      firstChar = fullAddress.slice(0, 1);
    }
    return fullAddress.trim();
  }

  setNewCaptionFromProfileCaption(profileCaption: string) {
    this.caption = profileCaption + ', ' + this.getShortAddressForCaption();
  }

  setNewCaptionFromShopName() {
    this.caption = [this.shopName, this.getShortAddressForCaption()].filter(s => !!s).join(', ');
  }

  getTitle(): string {
    return this.caption;
  }

  // tslint:disable-next-line:member-ordering
  static getEditRouteByIds(companyId: number, id: number, tab: string): any[] {
    return ['/backoffice/points/edit', companyId, id, tab];
  }

  getEditRoute(): any[] {
    return Point.getEditRouteByIds(this.companyId || 0, this.id, this.id ? 'summary' : 'form');
  }

  getTypedTitle(): string {
    return 'ТТ ' + this.getTitle();
  }

  get captionLine2(): string {
    return this.companyCaption;
  }
}
