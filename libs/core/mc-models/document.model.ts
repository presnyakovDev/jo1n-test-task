/* eslint-disable */
export class Document {
  id: number;
  caption: string;
  docIssuer: string;
  docIssuerCode: string;
  docIssuerDate: string;
  docNumber: string;
  docSeries: string;

  public static getFieldNames() {
    return {
      caption: 'Тип документа',
      docIssuer: 'Кем выдан',
      docIssuerCode: 'Код подразделения',
      docIssuerDate: 'Дата выдачи',
      docNumber: 'Номер',
      docSeries: 'Серия',
    };
  }

  constructor(item) {
    this.id = item.id;
    this.caption = item.caption;
    this.docIssuer = item.docIssuer || null;
    this.docIssuerCode = item.docIssuerCode || null;
    this.docIssuerDate = item.docIssuerDate || null;
    this.docNumber = item.docNumber || null;
    this.docSeries = item.docSeries || null;
  }
}
