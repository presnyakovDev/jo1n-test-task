/* eslint-disable */
import { McTranslateService, Page, PageData, PartnersApiService } from '@mc/core';
import { Selector } from './selector';

export class PartnerSelector implements Selector {
  constructor(private service: PartnersApiService) {}

  dialogTitle = 'Выберите партнера';
  searchTitle = 'Поиск по наименованию';
  captionTitle = 'Наименование';
  pageSize = 5;

  public initTranslate(translate: McTranslateService) {
    const translatableProperties = {
      'SELECTORS.PARTNER.DIALOG_TITLE': 'dialogTitle',
      'SELECTORS.PARTNER.SEARCH_TITLE': 'searchTitle',
      'SELECTORS.PARTNER.CAPTION_TITLE': 'captionTitle',
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
    return item.caption;
  }
}
