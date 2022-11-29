/* eslint-disable */
export class CompanyBankParams {
  id: number;
  companyId: number;
  integrationId: number;
  regionalOfficeId: number;
  integrationName: string;
  status: string;
  code: string;

  firstSendDate: string;
  lastSendDate: string;

  constructor(item) {
    {
      this.id = item.id;
      this.companyId = item.companyId;
      this.integrationId = item.integrationId;
      this.regionalOfficeId = item.regionalOfficeId || null;
      this.integrationName = item.integrationName || '???';
      this.status = item.status || '';
      this.firstSendDate = item.firstSendDate ? item.firstSendDate.substr(0, 10) : '';
      this.lastSendDate = item.lastSendDate || '';
      this.code = item.code;
    }
  }
}
