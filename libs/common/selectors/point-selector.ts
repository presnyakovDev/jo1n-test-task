/* eslint-disable */
import { McTranslateService, Page, PageData, PointsApiService } from '@mc/core';
import { Selector } from './selector';

export class PointSelector implements Selector {
  constructor(private service: PointsApiService) {}

  dialogTitle = 'Выберите торговую точку';
  searchTitle = 'Поиск по наименованию';
  captionTitle = 'Наименование (адрес)';
  pageSize = 5;

  public initTranslate(translate: McTranslateService) {
    const translatableProperties = {
      'SELECTORS.POINT.DIALOG_TITLE': 'dialogTitle',
      'SELECTORS.POINT.SEARCH_TITLE': 'searchTitle',
      'SELECTORS.POINT.CAPTION_TITLE': 'captionTitle',
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
    return item.caption + ' (ТТ: ' + item.address + ')';
  }
}
