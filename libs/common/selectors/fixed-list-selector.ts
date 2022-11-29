/* eslint-disable */
import { McApiUtils, McTranslateService, Page, PageData } from '@mc/core';
import { McFilterValue } from '../models/item-list-specs.model';
import { Selector } from './selector';

export class FixedListSelector implements Selector {
  dialogTitle = 'Select';
  searchTitle = 'Search';
  captionTitle = 'Caption';
  pageData: PageData = null;
  pageSize = 1000000;

  constructor(public entityTranslationKey: string, private listPromise: Promise<McFilterValue[]>) {}

  public initTranslate(translate: McTranslateService) {
    const translatableProperties = {};
    translatableProperties['SELECTORS.' + this.entityTranslationKey + '.DIALOG_TITLE'] = 'dialogTitle';
    translatableProperties['SELECTORS.' + this.entityTranslationKey + '.SEARCH_TITLE'] = 'searchTitle';
    translatableProperties['SELECTORS.' + this.entityTranslationKey + '.CAPTION_TITLE'] = 'captionTitle';
    translate.translateProps(this, { translatableProperties });
  }

  async getItemsDataOnPage({ searchText }: Page): Promise<PageData> {
    this.prepareFilterVariants(searchText);
    return this.pageData;
  }

  getItemCode(item: any): string {
    return '' + item.value;
  }

  getItemCaption(item: any): string {
    return item.caption;
  }

  private prepareFilterVariants(searchText) {
    this.pageData = new PageData({ loading: true });

    this.listPromise
      .then((results: any[]) => {
        this.pageData.loading = false;
        if (results.length) {
          this.pageData.items = searchText
            ? results.filter(item => item.caption.toUpperCase().includes(searchText.toUpperCase()))
            : results;
        } else {
          this.pageData.reason = 'EMPTY LIST';
          this.pageData.error = 'No filter options available';
        }
      })
      .catch(reason => {
        this.pageData.loading = false;
        this.pageData.reason = reason;
        this.pageData.error = McApiUtils.getErrorFromReason(reason);
      });
  }
}
