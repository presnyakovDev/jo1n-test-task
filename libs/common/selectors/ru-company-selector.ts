/* eslint-disable */
import { Page, CompaniesApiService, McTranslateService } from '@mc/core';
import { Selector } from './selector';

export class RuCompanySelector implements Selector {
  constructor(private service: CompaniesApiService) {}

  dialogTitle = 'Выберите юридическое лицо';
  searchTitle = 'Поиск по наименованию или ИНН';
  captionTitle = 'Наименование (ИНН)';
  innTitle = 'ИНН';
  pageSize = 5;

  public initTranslate(translate: McTranslateService) {
    const translatableProperties = {
      'SELECTORS.RU_COMPANY.DIALOG_TITLE': 'dialogTitle',
      'SELECTORS.RU_COMPANY.SEARCH_TITLE': 'searchTitle',
      'SELECTORS.RU_COMPANY.CAPTION_TITLE': 'captionTitle',
      'SELECTORS.RU_COMPANY.INN_TITLE': 'innTitle',
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
    return item.caption + ' (' + this.innTitle + ': ' + item.inn + ')';
  }
}
