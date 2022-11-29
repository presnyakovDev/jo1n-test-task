/* eslint-disable */
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { McFilterSpec, McFilterValue, McItemListSpecs } from '@mc/common';

import { Page, McSort } from '@mc/core';
import { Subject } from 'rxjs';
import { FuseItemSelectDialogComponent } from '../../fuse2017/item-select-dialog/item-select-dialog.component';

@Injectable()
export class Mc2021ListSettingsService {
  private page = new Page();
  private totalCount = 0;
  private pageSizeOptions = [10, 30, 50];
  private displayedColumns: string[] = [];
  private printedColumns: string[] = [];
  private itemListType: string;
  private filtersChanged = new Subject<void>();
  private columnsChanged = new Subject<void>();
  private dialog: MatDialog;
  private specs: McItemListSpecs;

  constructor() {}

  setDialog(dialog: MatDialog) {
    this.dialog = dialog;
  }

  getSpecs(): McItemListSpecs {
    return this.specs;
  }

  setSpecs(specs: McItemListSpecs) {
    this.specs = specs;
    this.itemListType = specs.itemsListType;
    this.displayedColumns = localStorage.getItem(specs.itemsListType + 'ItemListColumns')?.split(',');
    this.printedColumns = localStorage.getItem(specs.itemsListType + 'ItemListPrintedColumns')?.split(',');
  }

  onFiltersChanged(): Subject<void> {
    return this.filtersChanged;
  }

  onColumnsChanged(): Subject<void> {
    return this.columnsChanged;
  }

  clearPage() {
    this.page = new Page();
  }

  updatePageParams(params: { [key: string]: any }) {
    for (const key in params) {
      if (key in this.page) {
        this.page[key] = params[key];
      } else {
        this.page.filters.set(key, params[key]);
      }
    }
  }

  updatePageParam(field: string, value: string | number) {
    if (!(field in this.page)) {
      return;
    }
    this.page[field] = value;
  }

  setDisplayedColumns(columns: string[]) {
    if (!this.itemListType) {
      throw new Error('Empty itemListType!');
    }
    this.displayedColumns = columns;
    localStorage.setItem(this.itemListType + 'ItemListColumns', columns.join(','));
  }

  setPrintedColumns(columns: string[]) {
    if (!this.itemListType) {
      throw new Error('Empty itemListType!');
    }
    this.printedColumns = columns;
    localStorage.setItem(this.itemListType + 'ItemListPrintedColumns', columns.join(','));
  }

  setSortDirection(sortDirection: string) {
    this.updatePageParam('sortDirection', sortDirection);
  }
  setSortField(sortField: string) {
    this.updatePageParam('sortField', sortField);
  }
  setSearchText(searchText: string) {
    this.updatePageParam('searchText', searchText);
  }
  setPageSize(pageSize: number) {
    this.updatePageParam('pageSize', pageSize);
  }
  setPageNumber(pageNumber: number) {
    this.updatePageParam('pageNumber', pageNumber);
  }
  setItemsOnPageCount(itemsOnPageCount: number) {
    const offset = this.page.pageNumber * this.page.pageSize;
    const nextPageAvailable = itemsOnPageCount < this.page.pageSize ? 0 : 1;
    this.totalCount = offset + itemsOnPageCount + nextPageAvailable;
  }

  getPage(): Page {
    return this.page;
  }
  getFilters(): Map<string, string> {
    return this.page.filters;
  }
  getDisplayedColumns(): string[] {
    return this.displayedColumns;
  }
  getPrintedColumns(): string[] {
    return this.printedColumns;
  }
  getTotalCount(): number {
    return this.totalCount;
  }
  getPageSize(): number {
    return this.page.pageSize;
  }
  getPageNumber(): number {
    return this.page.pageNumber;
  }
  getSearchText(): string {
    return this.page.searchText;
  }
  getPageSizeOptions(): number[] {
    return this.pageSizeOptions;
  }
  getSortable(): McSort {
    return new McSort(this.page);
  }

  public async selectSingleFilterVariant(filter: McFilterSpec): Promise<McFilterValue> {
    if (typeof filter.selectVariant === 'function') {
      return await filter.selectVariant(this.dialog);
    } else {
      return await this.selectVariantWithSelector(filter);
    }
  }

  private selectVariantWithSelector(filter: McFilterSpec): Promise<McFilterValue> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(FuseItemSelectDialogComponent, {
        panelClass: 'item-select-dialog',
        data: filter.selectVariant,
      });

      dialogRef.afterClosed().subscribe(selection => {
        if (!selection) {
          return;
        }
        if (!selection.value) {
          selection = { value: selection.id, caption: selection.caption };
        }
        resolve(selection);
      });
    });
  }
}
