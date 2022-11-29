/* eslint-disable */
export class OperatorAgreementsForm {
  acceptEmailMessages: boolean;
  acceptPersdataProcessing: boolean;

  constructor(item) {
    if (!item) {
      item = {};
    }

    this.acceptEmailMessages = item.acceptEmailMessages || false;
    this.acceptPersdataProcessing = item.acceptPersdataProcessing || false;
  }
}
