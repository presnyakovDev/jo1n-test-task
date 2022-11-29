/* eslint-disable */
import { Injectable } from '@angular/core';

import { Page, McSort } from '@mc/core';

@Injectable({
  providedIn: 'root',
})
export class ItemListSettingsService {
  private settings: Map<string, Page> = new Map<string, Page>();
  private totalCount: Map<string, number> = new Map<string, number>();
  private pageSizeOptions: Map<string, number[]> = new Map<string, number[]>();
  private displayedColumns: Map<string, string[]> = new Map<string, string[]>();
  private printedColumns: Map<string, string[]> = new Map<string, string[]>();

  constructor() {}

  createItemListType(itemListType: string) {
    this.settings.set(itemListType, new Page());
    this.totalCount.set(itemListType, 0);
    this.pageSizeOptions.set(itemListType, [10, 30, 50]);
    const displayedColumns = localStorage.getItem(itemListType + 'ItemListColumns');
    this.displayedColumns.set(itemListType, displayedColumns ? displayedColumns.split(',') : null);
    const printedColumns = localStorage.getItem(itemListType + 'ItemListPrintedColumns');
    this.printedColumns.set(itemListType, printedColumns ? printedColumns.split(',') : null);
  }

  clearPage(itemListType: string) {
    this.createItemListType(itemListType);
    this.settings.set(itemListType, new Page());
  }

  updatePageParams(itemsListType: string, params: { [key: string]: any }) {
    const page = this.getPage(itemsListType);

    for (const key in params) {
      if (key in page) {
        page[key] = params[key];
      } else {
        page.filters.set(key, params[key]);
      }
    }
  }

  updatePageParam(itemsListType: string, field: string, value: string | number) {
    const page = this.getPage(itemsListType);
    if (!(field in page)) {
      return;
    }
    page[field] = value;
    this.settings.set(itemsListType, page);
  }

  setDisplayedColumns(itemListType: string, columns: string[]) {
    this.displayedColumns.set(itemListType, columns);
    localStorage.setItem(itemListType + 'ItemListColumns', columns.join(','));
  }

  setPrintedColumns(itemListType: string, columns: string[]) {
    this.printedColumns.set(itemListType, columns);
    localStorage.setItem(itemListType + 'ItemListPrintedColumns', columns.join(','));
  }

  setSortDirection(itemsListType: string, sortDirection: string) {
    this.updatePageParam(itemsListType, 'sortDirection', sortDirection);
  }
  setSortField(itemsListType: string, sortField: string) {
    this.updatePageParam(itemsListType, 'sortField', sortField);
  }
  setSearchText(itemsListType: string, searchText: string) {
    this.updatePageParam(itemsListType, 'searchText', searchText);
  }
  setPageSize(itemsListType: string, pageSize: number) {
    this.updatePageParam(itemsListType, 'pageSize', pageSize);
  }
  setPageNumber(itemsListType: string, pageNumber: number) {
    this.updatePageParam(itemsListType, 'pageNumber', pageNumber);
  }
  setItemsOnPageCount(itemsListType: string, itemsOnPageCount: number) {
    const page = this.getPage(itemsListType);
    const offset = page.pageNumber * page.pageSize;
    const nextPageAvailable = itemsOnPageCount < page.pageSize ? 0 : 1;
    this.totalCount.set(itemsListType, offset + itemsOnPageCount + nextPageAvailable);
  }

  getPage(itemsListType: string): Page {
    let page = this.settings.get(itemsListType);
    if (!page) {
      this.createItemListType(itemsListType);
      page = this.settings.get(itemsListType);
    }
    return page;
  }
  getFilters(itemsListType: string): Map<string, string> {
    return this.getPage(itemsListType).filters;
  }
  getDisplayedColumns(itemsListType: string): string[] {
    return this.displayedColumns.get(itemsListType);
  }
  getPrintedColumns(itemsListType: string): string[] {
    return this.printedColumns.get(itemsListType);
  }
  getTotalCount(itemListType: string): number {
    return this.totalCount.get(itemListType);
  }
  getPageSize(itemsListType: string): number {
    return this.getPage(itemsListType).pageSize;
  }
  getPageNumber(itemsListType: string): number {
    return this.getPage(itemsListType).pageNumber;
  }
  getSearchText(itemsListType: string): string {
    return this.getPage(itemsListType).searchText;
  }
  getPageSizeOptions(itemsListType: string): number[] {
    return this.pageSizeOptions.get(itemsListType);
  }
  getSortable(itemsListType: string): McSort {
    return new McSort(this.getPage(itemsListType));
  }
}
