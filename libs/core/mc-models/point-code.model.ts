/* eslint-disable */
export class PointCode {
  id: number;
  pointId: number;
  integrationId: number;
  regionalOfficeId: number;
  integrationName: string;
  status: string;

  disabled: boolean;
  disableReason: string;
  code: string;
  codeExt: string;
  firstSendDate: string;
  lastSendDate: string;
  extCodeDate: string;

  public static disableReasonVariants(): any[] {
    return [
      { id: 'Заблокирован службой безопасности банка', caption: 'Заблокирован службой безопасности банка' },
      { id: 'Не кредитуемый рынок', caption: 'Некредитуемый рынок' },
      { id: 'Не кредитуемый регион', caption: 'Некредитуемый регион' },
      { id: 'Режим обучения', caption: 'Режим обучения' },
      { id: 'Заблокировано юридическое лицо', caption: 'Заблокировано юридическое лицо' },
    ];
  }

  constructor(item) {
    {
      this.id = item.id;
      this.pointId = item.pointId;
      this.integrationId = item.integrationId;
      this.regionalOfficeId = item.regionalOfficeId || null;
      this.integrationName = item.integrationName || '???';
      this.status = item.status || '';

      this.disabled = item.disabled || item.status === 'disabled' || false;
      this.disableReason = item.disableReason || '';
      this.code = item.code || '';
      this.codeExt = item.codeExt || '';
      this.firstSendDate = item.firstSendDate ? item.firstSendDate.substr(0, 10) : '';
      this.lastSendDate = item.lastSendDate || '';
      this.extCodeDate = item.extCodeDate || '';
    }
  }

  public get disableReasonShort(): string {
    if (this.disableReason === 'Заблокирован службой безопасности банка') {
      return 'OTKAZ-SB';
    }
    if (this.disableReason === 'Не кредитуемый рынок') {
      return 'OTKAZ-RYNOK';
    }
    if (this.disableReason === 'Не кредитуемый регион') {
      return 'OTKAZ-REGION';
    }
    if (this.disableReason === 'Режим обучения') {
      return 'OTKAZ-OBUCH';
    }
    if (this.disableReason === 'Заблокировано юридическое лицо') {
      return 'OTKAZ-UL';
    }
    return this.disableReason;
  }
}
