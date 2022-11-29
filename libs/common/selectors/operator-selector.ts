/* eslint-disable */
import { Page, OperatorsApiService, PageData, McTranslateService } from '@mc/core';
import { Selector } from './selector';

export class OperatorSelector implements Selector {
  constructor(private service: OperatorsApiService) {}

  dialogTitle = 'Выберите оператора';
  searchTitle = 'Поиск по ФИО';
  captionTitle = 'ФИО (торговая точка)';
  pageSize = 5;

  public initTranslate(translate: McTranslateService) {
    const translatableProperties = {
      'SELECTORS.OPERATOR.DIALOG_TITLE': 'dialogTitle',
      'SELECTORS.OPERATOR.SEARCH_TITLE': 'searchTitle',
      'SELECTORS.OPERATOR.CAPTION_TITLE': 'captionTitle',
    };
    translate.translateProps(this, { translatableProperties });
  }

  getItemsDataOnPage(page: Page): Promise<PageData> {
    return this.service.getItemsDataOnPage(page);
  }

  getItemCode(item: any): string {
    return '' + item.id;
  }

  getItemCaption(item: any): string {
    return item.caption + ' (ТТ: ' + item.pointCaption + ')';
  }
}
