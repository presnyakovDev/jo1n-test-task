/* eslint-disable */
import { McUtils } from '../mc-utils';

export class Partner {
  id = 0;

  // common
  status: string;
  caption: string;
  description: string;
  timezone: string;
  infoStatusId: number;
  infoStatusCaption: string;

  // contacts
  documentContactFullname: string;
  documentContactPhone: string;
  documentContactEmail: string;
  authorizedContactFullname: string;
  authorizedContactPhone: string;
  authorizedContactEmail: string;

  allAccessControlGroups: any;
  accessControlGroups: any;
  salesAccessGroup: string;
  salesAccessGroupElem: any;
  callCenterAccessGroup: string;
  callCenterAccessGroupElem: any;
  crmSettings: any;

  public static getFieldNamesSplittedByFormParts(): any[] {
    return [
      {
        '*sectionTitle': 'COMMON.GENERAL_INFORMATION',
        caption: 'BACKOFFICE.COMMON.PARTNER_NAME',
        description: 'BACKOFFICE.FORMS.COMMENT',
        timezone: 'BACKOFFICE.COMMON.TIME_ZONE',
      },
      {
        '*sectionTitle': 'BACKOFFICE.FORMS.DOCUMENT_COLLECTION_CONTACT',
        documentContactFullname: 'BACKOFFICE.COMMON.FULL_NAME',
        documentContactPhone: 'BACKOFFICE.FORMS.PHONE',
        documentContactEmail: 'BACKOFFICE.FORMS.EMAIL',
        siteUrl: 'BACKOFFICE.FORMS.WEBSITE',
      },
      {
        '*sectionTitle': 'BACKOFFICE.FORMS.DECISION_MAKER',
        authorizedContactFullname: 'BACKOFFICE.COMMON.FULL_NAME',
        authorizedContactPhone: 'BACKOFFICE.FORMS.PHONE',
        authorizedContactEmail: 'BACKOFFICE.FORMS.EMAIL',
      },
    ];
  }

  constructor(item) {
    this.id = item.id;

    this.status = item.status || null;
    this.caption = item.caption || '';
    this.description = item.description || null;
    this.timezone = item.timezone || null;
    this.infoStatusId = item.infoStatusId || null;

    this.documentContactFullname = item.documentContactFullname || null;
    this.documentContactPhone = item.documentContactPhone || null;
    this.documentContactEmail = item.documentContactEmail || null;
    this.crmSettings = item.crmSettings || null;

    this.authorizedContactFullname = item.authorizedContactFullname || null;
    this.authorizedContactPhone = item.authorizedContactPhone || null;
    this.authorizedContactEmail = item.authorizedContactEmail || null;
    this.infoStatusCaption = item.infoStatusCaption || '';

    this.allAccessControlGroups = item.accessControlGroups || [];
    this.accessControlGroups = item.accessControlGroups ? item.accessControlGroups.filter(elem => elem.owner) : [];

    const ownerAccessControlGroups = this.accessControlGroups.filter(group => group.owner);
    this.salesAccessGroup = McUtils.getAccessGroupTitle(ownerAccessControlGroups, 'sales');
    this.salesAccessGroupElem = ownerAccessControlGroups.find(elem => elem.accessRole === 'sales');

    this.callCenterAccessGroup = McUtils.getAccessGroupTitle(this.accessControlGroups, 'callcenter');
    this.callCenterAccessGroupElem = this.accessControlGroups.find(elem => elem.accessRole === 'callcenter');

    if (this.crmSettings) {
      this.authorizedContactFullname = this.crmSettings.authorizedContactFullName || null;
      this.authorizedContactPhone = this.crmSettings.authorizedContactPhone || null;
      this.authorizedContactEmail = this.crmSettings.authorizedContactEmail || null;
    }
  }

  getAccessGroup(type: 'sales' | 'callcenter' | 'backoffice') {
    return this.accessControlGroups.find(item => item.accessRole === type);
  }

  getFillPercent() {
    const p1 = this.caption ? 30 : 0;
    const p2 = this.timezone ? 10 : 0;
    const c1a = this.documentContactFullname ? 10 : 0;
    const c1b = this.documentContactPhone ? 10 : 0;
    const c1c = this.documentContactEmail ? 10 : 0;
    const c2a = this.authorizedContactFullname ? 10 : 0;
    const c2b = this.authorizedContactPhone ? 10 : 0;
    const c2c = this.authorizedContactEmail ? 10 : 0;

    return p1 + p2 + c1a + c1b + c1c + c2a + c2b + c2c;
  }

  getTitle(): string {
    return this.caption;
  }

  // tslint:disable-next-line:member-ordering
  static getEditRouteByIds(id: number, tab: string): any[] {
    return ['/backoffice/partners/edit', id, tab];
  }

  getEditRoute(tab?: string): any[] {
    tab = tab || (this.id ? 'summary' : 'wizard');
    return Partner.getEditRouteByIds(this.id, tab);
  }

  getTypedTitle(): string {
    return this.getTitle();
  }
}
