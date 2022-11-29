/* eslint-disable */
export class OperatorCode {
  id: number;
  operatorId: number;
  integrationId: number;
  regionalOfficeId: number;
  integrationName: string;
  status: string;

  disabled: boolean;
  disableReason: string;
  username: string;
  firstSendDate: string;
  lastSendDate: string;
  extCodeDate: string;

  public static disableReasonVariants(): string[] {
    return ['Заблокирован службой безопасности банка', 'Режим обучения'];
  }

  constructor(item) {
    this.id = item.id;
    this.operatorId = item.operatorId;
    this.integrationId = item.integrationId;
    this.regionalOfficeId = item.regionalOfficeId || null;
    this.integrationName = item.integrationName || '???';
    this.status = item.status || '';

    this.disabled = item.disabled || item.status === 'disabled' || false;
    this.disableReason = item.disableReason || '';
    this.username = item.username || '';
    this.firstSendDate = item.firstSendDate ? item.firstSendDate.substr(0, 10) : '';
    this.lastSendDate = item.lastSendDate || '';
    this.extCodeDate = item.extCodeDate || '';
  }

  public get disableReasonShort(): string {
    if (this.disableReason === 'Заблокирован службой безопасности банка') {
      return 'OTKAZ-SB';
    }
    if (this.disableReason === 'Режим обучения') {
      return 'OTKAZ-OBUCH';
    }
    return this.disableReason;
  }
}
