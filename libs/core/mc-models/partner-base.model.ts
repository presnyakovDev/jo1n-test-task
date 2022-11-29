/* eslint-disable */
import { McUtils } from '../mc-utils';

export class PartnerBase {
  id = 0;

  // common
  status: string;
  caption: string;
  description: string;
  timezone: string;
  infoStatusCode: string;
  infoStatusCaption: string;

  allAccessControlGroups: any;
  accessControlGroups: any;
  salesAccessGroup: string;
  salesAccessGroupElem: any;
  callCenterAccessGroup: string;
  callCenterAccessGroupElem: any;
  crmSettings: any;

  salesTerritory: any;

  constructor(item) {
    this.id = item.id;

    this.status = item.status || null;
    this.caption = item.caption || '';
    this.description = item.description || null;
    this.timezone = item.timezone || null;
    this.infoStatusCode = item.infoStatusCode || null;

    this.crmSettings = item.crmSettings || {};

    this.allAccessControlGroups = item.accessControlGroups || [];
    this.accessControlGroups = item.accessControlGroups ? item.accessControlGroups.filter(elem => elem.owner) : [];

    const ownerAccessControlGroups = this.accessControlGroups.filter(group => group.owner);
    this.salesAccessGroup = McUtils.getAccessGroupTitle(ownerAccessControlGroups, 'sales');
    this.salesAccessGroupElem = ownerAccessControlGroups.find(elem => elem.accessRole === 'sales');

    this.callCenterAccessGroup = McUtils.getAccessGroupTitle(this.accessControlGroups, 'callcenter');
    this.callCenterAccessGroupElem = this.accessControlGroups.find(elem => elem.accessRole === 'callcenter');

    this.salesTerritory = item.salesTerritory;
  }

  getAccessGroup(type: 'sales' | 'callcenter' | 'backoffice') {
    return this.accessControlGroups.find(item => item.accessRole === type);
  }

  // tslint:disable-next-line:member-ordering
  static getEditRouteByIds(id: number, tab: string): any[] {
    return ['/backoffice/partners/edit', id, tab];
  }

  getEditRoute(tab?: string): any[] {
    tab = tab || (this.id ? 'summary' : 'wizard');
    return PartnerBase.getEditRouteByIds(this.id, tab);
  }
}
