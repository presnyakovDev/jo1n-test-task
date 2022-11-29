/* eslint-disable */
import { McUtils } from '../mc-utils';
import { CompanyBankParams } from './company-bank-params.model';

export class CompanyBase {
  id: number;

  partnerId: number;
  partnerCaption: string;
  contractCompanyId: number;

  infoStatusCode: string;
  infoStatusCaption: string;

  crmSettings: any;

  numberOfPoints: number;

  // common
  code: string;
  caption: string;
  description: string;
  address: string;

  // bank account
  bankBic: string;
  bankName: string;
  bankCorrespondentAccount: string;
  bankCurrentAccount: string;

  accessControlGroups: any;
  salesAccessGroup: string;

  bankParams: CompanyBankParams[];

  salesTerritory: any;

  static getBuildInFieldList() {
    return [
      'id',
      'code',
      'caption',
      'description',
      'address',
      'bankBic',
      'bankName',
      'bankCorrespondentAccount',
      'bankCurrentAccount',
    ];
  }

  constructor(item) {
    this.partnerId = item.partnerId;
    this.partnerCaption = item.partnerCaption || null;
    this.infoStatusCode = item.infoStatusCode || null;
    this.infoStatusCaption = item.infoStatusCaption || null;
    this.salesTerritory = item.salesTerritory;

    this.crmSettings = item.crmSettings || {};

    this.id = item.id;
    this.code = item.code || '';
    this.caption = item.caption || '';
    this.contractCompanyId = item.contractCompanyId || null;
    this.description = item.description || null;
    this.address = item.address || null;

    this.bankBic = item.bankBic || null;
    this.bankName = item.bankName || null;
    this.bankCorrespondentAccount = item.bankCorrespondentAccount || null;
    this.bankCurrentAccount = item.bankCurrentAccount || null;

    this.accessControlGroups = item.accessControlGroups ? item.accessControlGroups.filter(elem => elem.owner) : [];
    this.salesAccessGroup = McUtils.getAccessGroupTitle(this.accessControlGroups, 'sales');
  }

  // tslint:disable-next-line:member-ordering
  static getEditRouteByIds(partnerId: number, id: number, tab: string): any[] {
    return ['/backoffice/companies/edit', partnerId, id, tab];
  }

  getEditRoute(tab?: string): any[] {
    return CompanyBase.getEditRouteByIds(
      this.partnerId || 0,
      this.id,
      tab === undefined ? (this.id ? 'summary' : 'form') : tab,
    );
  }

  getUpdateRoute(requestId: number): any[] {
    return ['/backoffice/companies/edit', this.partnerId || 0, this.id || 0, 'update-request', requestId];
  }
}
