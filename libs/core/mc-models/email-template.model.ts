/* eslint-disable */
export class EmailTemplate {
  bodyTemplate: string;
  contentType: string;
  subjectTemplate: string;

  constructor(item: any) {
    this.bodyTemplate = item ? item.bodyTemplate : '';
    this.contentType = item ? item.contentType : 'HTML';
    this.subjectTemplate = item ? item.subjectTemplate : '';
  }
}
