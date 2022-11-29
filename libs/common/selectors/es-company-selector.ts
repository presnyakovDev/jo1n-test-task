/* eslint-disable */
import { Page, CompaniesApiService, McTranslateService } from '@mc/core';
import { Selector } from './selector';

export class EsCompanySelector implements Selector {
  constructor(private service: CompaniesApiService) {}

  dialogTitle = 'Выберите юридическое лицо';
  searchTitle = 'Поиск по наименованию';
  captionTitle = 'Наименование';
  pageSize = 5;

  public initTranslate(translate: McTranslateService) {
    const translatableProperties = {
      'SELECTORS.ES_COMPANY.DIALOG_TITLE': 'dialogTitle',
      'SELECTORS.ES_COMPANY.SEARCH_TITLE': 'searchTitle',
      'SELECTORS.ES_COMPANY.CAPTION_TITLE': 'captionTitle',
    };
    translate.translateProps(this, { translatableProperties });
  }

  getItemsDataOnPage(page: Page) {
    return this.service.getItemsDataOnPage(page);
  }

  getItemCode(item: any): string {
    return '' + item.id;
  }

  getItemCaption(item: any): string {
    return item.caption;
  }
}
