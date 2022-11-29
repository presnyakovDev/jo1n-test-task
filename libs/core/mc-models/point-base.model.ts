/* eslint-disable */
import { McUtils } from '../mc-utils';
import { PointCode } from './point-code.model';

export class PointBase {
  id: number;
  code: string;
  description: string;
  companyId: number;
  infoStatusCode: string;
  infoStatusCaption: string;
  active: boolean;

  createstamp: string;
  changestamp: string;
  crmSettings: any;

  accessControlGroups: any;
  salesAccessGroup: string;

  caption: string;
  territoryId: number;

  marketId: number;
  marketCaption: string;

  address: string;
  cityAddress: string;
  cityCode: string;
  cityCaption: string;
  coordinatesGPS: string;
  countryCode: string;
  countryCaption: string;
  postalCode: string;
  regionCode: string;
  regionCaption: string;

  shopName: string;

  bankCodes: PointCode[];

  // joined fields
  partnerId: number;
  partnerCaption: string;
  companyCaption: string;

  salesTerritory: any;

  constructor(item) {
    this.id = item.id;
    this.code = item.code || null;
    this.companyId = item.companyId;
    this.infoStatusCode = item.infoStatusCode || null;
    this.active = item.active;

    this.salesTerritory = item.salesTerritory;

    this.createstamp = item.createStamp;
    this.changestamp = item.changeStamp;
    this.crmSettings = item.crmSettings || {};

    this.caption = item.caption || '';
    this.description = item.description || null;
    this.territoryId = item.territoryId || null;
    this.address = item.address || null;

    this.bankCodes = item.bankCodes ? item.bankCodes.map(code => new PointCode({ ...code, pointId: item.id })) : [];

    this.partnerId = item.partnerId || null;
    this.partnerCaption = item.partnerCaption || null;
    this.companyCaption = item.companyCaption || null;

    this.accessControlGroups = item.accessControlGroups ? item.accessControlGroups.filter(elem => elem.owner) : [];
    this.salesAccessGroup = McUtils.getAccessGroupTitle(this.accessControlGroups, 'sales');

    this.cityAddress = item.cityAddress || null;
    this.cityCode = item.cityCode || null;
    this.cityCaption = item.cityCaption || null;
    this.countryCode = item.countryCode || null;
    this.countryCaption = item.countryCaption || null;
    this.regionCode = item.regionCode || null;
    this.regionCaption = item.regionCaption || null;
    this.marketId = item.marketId || null;
    this.marketCaption = item.marketCaption || null;
    this.postalCode = item.postalCode || null;
    this.shopName = item.shopName || null;
    this.coordinatesGPS = item.coordinatesGPS || null;
  }

  getAccessGroup(type: 'sales' | 'backoffice') {
    return this.accessControlGroups.find(item => item.accessRole === type);
  }

  getShortAddressForCaption() {
    let fullAddress = this.address;
    if (!fullAddress) {
      return '';
    }

    if (fullAddress.indexOf('; ') > 0) {
      return fullAddress.slice(fullAddress.indexOf('; ') + 2);
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
    this.caption = [this.crmSettings.shopName, this.getShortAddressForCaption()].filter(s => !!s).join(', ');
  }

  // tslint:disable-next-line:member-ordering
  static getEditRouteByIds(companyId: number, id: number, tab: string): any[] {
    return ['/backoffice/points/edit', companyId, id, tab];
  }

  getEditRoute(tab?: string): any[] {
    return PointBase.getEditRouteByIds(
      this.companyId || 0,
      this.id,
      tab === undefined ? (this.id ? 'summary' : 'form') : tab,
    );
  }

  getUpdateRoute(requestId: number): any[] {
    return ['/backoffice/points/edit', this.companyId || 0, this.id || 0, 'update-request', requestId];
  }
}
