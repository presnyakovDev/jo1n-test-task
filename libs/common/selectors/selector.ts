/* eslint-disable */
import { Page, PageData } from '@mc/core';

export interface Selector {
  pageSize: number;
  dialogTitle: string;
  searchTitle: string;
  captionTitle: string;
  getItemsDataOnPage(page: Page): Promise<PageData>;
  getItemCode(item: any): string;
  getItemCaption(item: any): string;
}
