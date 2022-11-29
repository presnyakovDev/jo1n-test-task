/* eslint-disable */
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Input,
  ChangeDetectorRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { moveItemInArray, CdkDragDrop, CdkDrag } from '@angular/cdk/drag-drop';
import { takeUntil, first } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';

import { fuseAnimations, Page, McUtils, FusePerfectScrollbarDirective, McAlertService, ReportsCommon } from '@mc/core';
import { FuseNavbarVerticalService } from '../navbar/vertical/navbar-vertical.service';
import {
  McItemListSpecs,
  McFilterSpec,
  McListColumnSpec,
  McFilterValue,
} from '../../../common/models/item-list-specs.model';
import { ItemListSettingsService } from '../../../common/services/settings.service';
import { McListSettingsDialogComponent } from './list-settings-dialog/list-settings-dialog.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { McAppInfoService } from '@mc/core';
import { FuseItemSelectDialogComponent } from '../item-select-dialog/item-select-dialog.component';

@Component({
  selector: 'mc-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class McItemListComponent implements OnInit, AfterViewInit {
  resizing$ = new Subject<boolean>();
  reordering$ = new Subject<boolean>();
  loading$ = new Subject<boolean>();
  rowWidth = 0;
  error: string = null;
  dataSource = [];
  navbar: any;
  @BlockUI() blockUI: NgBlockUI;

  get page() {
    return this.settingsService.getPage(this.specs.itemsListType);
  }
  get pageSize() {
    return this.settingsService.getPageSize(this.specs.itemsListType);
  }
  get pageSizeOptions() {
    return this.settingsService.getPageSizeOptions(this.specs.itemsListType);
  }
  get totalCount() {
    return this.settingsService.getTotalCount(this.specs.itemsListType);
  }
  get pageIndex() {
    return this.settingsService.getPageNumber(this.specs.itemsListType);
  }
  get displayedColumns() {
    const columns = this.settingsService.getDisplayedColumns(this.specs.itemsListType);
    return this.specs.columns
      .filter(column => (columns ? columns.includes(column.id) : column.showByDefault))
      .map(column => column.id);
  }
  get printedColumns() {
    const columns = this.settingsService.getPrintedColumns(this.specs.itemsListType);
    return this.specs.columns
      .filter(column => (columns ? columns.includes(column.id) : column.showByDefault))
      .map(column => column.id);
  }
  get displayedColumnsSpecs() {
    const columns = this.settingsService.getDisplayedColumns(this.specs.itemsListType);
    return this.specs.columns.filter(column => (columns ? columns.includes(column.id) : column.showByDefault));
  }

  @Input() specs: McItemListSpecs;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('table', { read: MatSort, static: true }) sort: MatSort;
  @ViewChild('scrollContainer', { read: FusePerfectScrollbarDirective, static: true })
  scrollBar: FusePerfectScrollbarDirective;

  constructor(
    private navbarService: FuseNavbarVerticalService,
    private router: Router,
    private route: ActivatedRoute,
    public settingsService: ItemListSettingsService,
    private dialog: MatDialog,
    private alertService: McAlertService,
    private appInfo: McAppInfoService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    setTimeout(() => this.appInfo.setTitle(this.specs.caption), 1);
    this.navbar = this.navbarService.getNavBar();

    this.paginator.page.subscribe(page => {
      const pageIndex = +page.pageSize === +this.pageSize ? page.pageIndex : 0;
      this.settingsService.setPageSize(this.specs.itemsListType, page.pageSize);
      this.onPageUpdate(pageIndex);
    });

    this.sort.sortChange.subscribe(sort => {
      this.settingsService.setSortField(this.specs.itemsListType, sort.direction ? sort.active : '');
      this.settingsService.setSortDirection(this.specs.itemsListType, sort.direction);
      this.onPageUpdate();
    });

    this.route.queryParams.subscribe(async params => {
      if (params.default === 'true') {
        this.settingsService.clearPage(this.specs.itemsListType);
        this.storePageParams();
        // tslint:disable-next-line: no-shadowed-variable
        const queryParams = {};
        this.updateQueryParamsIfNeed(queryParams);
        this.navigateByParams(queryParams);
        return;
      }

      if (Object.keys(params).length === 0) {
        const settings = localStorage.getItem(this.specs.itemsListType + 'ItemListSettings');
        if (settings) {
          // tslint:disable-next-line: no-shadowed-variable
          const queryParams = JSON.parse(settings);
          this.updateQueryParamsIfNeed(queryParams);
          this.navigateByParams(queryParams);
          return;
        }
      }

      const queryParams = { ...params };
      if (this.updateQueryParamsIfNeed(queryParams)) {
        this.navigateByParams(queryParams);
        return;
      }

      this.settingsService.updatePageParams(this.specs.itemsListType, params);
      await this.updateSelectedValuesByPageFilters();
      this.updateItemsByPage();
    });
  }

  ngAfterViewInit() {
    (<Promise<any>>this.specs.ready || <Promise<any>>Promise.resolve()).then(() => {
      this.updateColumnsWidthFromStorage();
      this.setRowWidth();
      this.restoreColumnsOrders();
    });
  }

  updateQueryParamsIfNeed(params: any): boolean {
    let needUpdate = false;

    this.specs.filters.forEach(filter => {
      if (filter.defaultValue && !(filter.field in params)) {
        params[filter.field] = filter.defaultValue.value;
        needUpdate = true;
      }
    });

    const pageParams = this.getPageParams();
    for (const key in pageParams) {
      if (!params[key]) {
        params[key] = pageParams[key];
        needUpdate = true;
      }
    }

    return needUpdate;
  }

  navigateByParams(params: any) {
    this.router.navigate([], { queryParams: params });
  }

  navigateByPageParams() {
    this.router.navigate([], { queryParams: this.getPageParams() });
  }

  getPageParams() {
    const page = this.settingsService.getPage(this.specs.itemsListType);
    const obj = {
      pageSize: page.pageSize,
      pageNumber: page.pageNumber,
    };

    if (page.sortDirection) {
      obj['sortDirection'] = page.sortDirection;
    }
    if (page.sortField) {
      obj['sortField'] = page.sortField;
    }
    if (page.searchText) {
      obj['searchText'] = page.searchText;
    }

    page.filters.forEach((value, key) => (obj[key] = value));

    return obj;
  }

  async updateSelectedValuesByPageFilters() {
    const filters = this.settingsService.getFilters(this.specs.itemsListType);

    await Promise.all(this.specs.filters.map(filter => filter.fillSelectedValue(filters.get(filter.field))));
  }

  storePageParams() {
    const obj = this.getPageParams();
    localStorage.setItem(this.specs.itemsListType + 'ItemListSettings', JSON.stringify(obj));
  }

  onPageUpdate(pageIndex: number = 0) {
    this.settingsService.setPageNumber(this.specs.itemsListType, pageIndex);
    this.storePageParams();
    this.navigateByPageParams();
  }

  async updateItemsByPage(): Promise<any> {
    this.dataSource = [];
    this.error = null;
    this.loading$.next(true);

    try {
      const items = await this.specs.getItemsOnPage(this.getPageForApi());
      this.dataSource = items;
      this.settingsService.setItemsOnPageCount(this.specs.itemsListType, items.length);
      this.scrollBar.scrollToTop();
    } catch (error) {
      this.error = McUtils.getErrMsg(error)[0];
    } finally {
      this.loading$.next(false);
    }
  }

  getPageForApi(): Page {
    const page = Page.getCopy(this.page);
    page.filters.clear();
    this.specs.filters.forEach(filter => filter.applyToPage(page));

    return page;
  }

  settingsClick() {
    const columns = this.settingsService.getDisplayedColumns(this.specs.itemsListType);
    const dialogRef = this.dialog.open(McListSettingsDialogComponent, {
      panelClass: 'mc-list-settings-dialog',
      data: {
        availableColumns: this.specs.columns,
        selectedColumns: columns
          ? columns
          : this.specs.columns.filter(column => column.showByDefault).map(column => column.id),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settingsService.setDisplayedColumns(this.specs.itemsListType, result);
        this.setRowWidth();
      }
    });
  }

  onExportToXlsClick() {
    const dialogRef = this.dialog.open(McListSettingsDialogComponent, {
      panelClass: 'mc-list-settings-dialog',
      data: {
        dialogTitle: 'XLS export settings',
        rightButtonText: 'Export XLS',
        availableColumns: this.specs.columns,
        selectedColumns: this.printedColumns,
        dialogTitleTranslationKey: 'COMMON.XLS_SETTINGS',
        rightButtonTextTranslationKey: 'COMMON.XLS_ACTION',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settingsService.setPrintedColumns(this.specs.itemsListType, result);
        this.exportToXLS();
      }
    });
  }

  setSearchString(searchText: string) {
    this.settingsService.setSearchText(this.specs.itemsListType, searchText);
    this.onPageUpdate();
  }

  selectVariantWithSelector(filter: McFilterSpec): Promise<McFilterValue> {
    return new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(FuseItemSelectDialogComponent, {
        panelClass: 'item-select-dialog',
        data: filter.selectVariant,
      });

      dialogRef.afterClosed().subscribe(selection => resolve(selection));
    });
  }

  setFilter(filter: McFilterSpec) {
    if (typeof filter.selectVariant === 'function') {
      filter.selectVariant(this.dialog).then(selection => this.filterValueSelected(filter, selection));
    } else {
      this.selectVariantWithSelector(filter).then((selection: any) => {
        if (!selection.value) {
          selection = { value: selection.id, caption: selection.caption };
        }
        this.filterValueSelected(filter, selection);
      });
    }
  }

  filterValueSelected(filter: McFilterSpec, result: McFilterValue) {
    if (result) {
      this.settingsService.updatePageParams(this.specs.itemsListType, { [filter.field]: result.value });
      this.onPageUpdate();
    }
  }

  getSafeStyle(style: string): SafeStyle {
    if (!style) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustStyle(style);
  }

  removeFilter(filter: McFilterSpec) {
    this.page.filters.delete(filter.field);
    this.onPageUpdate();
  }

  addItem() {
    this.router.navigate(this.specs.addItemRoute());
  }

  async editItem(item: any) {
    const itemRoute = await this.specs.editItemRoute(item);
    const queryParams = Boolean(this.specs.queryParams) ? await this.specs.queryParams(item) : {};
    this.router.navigate(itemRoute, { queryParams: queryParams });
  }

  prepareExcelData(items, columns) {
    const cols = columns;
    return [cols.map(col => col.caption), ...items.map(item => cols.map(col => col.content(item)))];
  }

  exportToXLS() {
    const listType = this.specs.itemsListType;
    const filename = `${listType}.xlsx`;
    const page = this.getPageForApi();
    page.pageNumber = 0;
    page.pageSize = 100;

    this.blockUI.start('Loading...');
    this.getItemsOnPagesFrom(page)
      .then(items => {
        this.blockUI.stop();
        const colsForXls = this.specs.columns.filter(column => this.printedColumns.indexOf(column.id) !== -1);
        const reportData = this.prepareExcelData(items, colsForXls);
        ReportsCommon.saveReport(reportData, filename);
      })
      .catch(reason => {
        this.blockUI.stop();
        this.alertService.alertReason('Error', reason);
      });
  }

  public getItemsOnPagesFrom(page: Page): Promise<Array<any>> {
    const nextPage = new Page();
    nextPage.searchText = page.searchText;
    nextPage.filters = page.filters;
    nextPage.pageSize = page.pageSize;
    nextPage.sortField = page.sortField;
    nextPage.sortDirection = page.sortDirection;
    nextPage.pageNumber = page.pageNumber + 1;

    return new Promise((resolve, reject) => {
      this.specs
        .getItemsOnPage(page)
        .then(items => {
          if (items.length < 100) {
            resolve(items);
          } else {
            this.getItemsOnPagesFrom(nextPage)
              .then(moreItems => {
                items.push(...moreItems);
                resolve(items);
              })
              .catch(reason => reject(reason));
          }
        })
        .catch(reason => reject(reason));
    });
  }

  setRowWidth() {
    let width = 0;

    this.specs.columns
      .filter(column => this.displayedColumns.includes(column.id))
      .forEach(column => {
        width += column.width || 0;
      });

    this.rowWidth = width;
    this.cdr.detectChanges();
  }

  updateColumnsWidthFromStorage() {
    const columnsParams = JSON.parse(localStorage.getItem(this.specs.itemsListType + 'ItemListColumnsParams'));

    if (!columnsParams) {
      return;
    }

    for (const field of Object.keys(columnsParams)) {
      const column = this.specs.columns.find(item => item.id === field);

      if (column) {
        column.width = +columnsParams[field] || column.width;
      }
    }
  }

  storeColumnWidth() {
    const object = {};
    this.specs.columns.forEach(column => (object[column.id] = column.width));
    localStorage.setItem(this.specs.itemsListType + 'ItemListColumnsParams', JSON.stringify(object));
  }

  onResizeColumn(event: any, column: McListColumnSpec) {
    event.stopPropagation();
    this.resizing$.next(true);
    let prevPositionX = event.pageX;
    const minWidth = 50;
    const mouseup$ = new Subject<boolean>();
    const mouseupEventHandler = e => {
      e.stopPropagation();
      mouseup$.next(true);
    };

    document.addEventListener('mouseup', mouseupEventHandler, true);

    mouseup$.pipe(first()).subscribe(e => {
      document.removeEventListener('mouseup', mouseupEventHandler, true);
      this.resizing$.next(false);
      this.storeColumnWidth();
    });

    fromEvent(document, 'mousemove')
      .pipe(takeUntil(mouseup$))
      .subscribe((e: any) => {
        const offset = e.pageX - prevPositionX;

        if (column.width + offset < minWidth && offset < 0) {
          return;
        }

        column.width += offset;

        prevPositionX = e.pageX;
        this.setRowWidth();
      });
  }

  columnDragStarted() {
    this.reordering$.next(true);
  }

  columnDropped(event: CdkDragDrop<string[]>) {
    this.reordering$.next(false);
    const prevItem = this.displayedColumns[event.previousIndex];
    const currentItem = this.displayedColumns[event.currentIndex];
    const prevIndex = this.specs.columns.findIndex(item => item.id === prevItem);
    const currentIndex = this.specs.columns.findIndex(item => item.id === currentItem);
    moveItemInArray(this.specs.columns, prevIndex, currentIndex);
    this.storeColumnsOrders();
    this.cdr.detectChanges();
  }

  storeColumnsOrders() {
    localStorage.setItem(
      this.specs.itemsListType + 'ItemListColumnsOrders',
      JSON.stringify(this.specs.columns.map(item => item.id)),
    );
  }

  restoreColumnsOrders() {
    try {
      const columnsString = localStorage.getItem(this.specs.itemsListType + 'ItemListColumnsOrders');
      const columns = JSON.parse(columnsString) as Array<string>;
      const columnsObj = {};

      columns.forEach((item, index) => (columnsObj[item] = index));

      if (Array.isArray(columns)) {
        this.specs.columns.sort((a, b) => {
          if (columnsObj[a.id] < columnsObj[b.id]) {
            return -1;
          }
          if (columnsObj[a.id] > columnsObj[b.id]) {
            return 1;
          }

          return 0;
        });
        this.cdr.detectChanges();
      }
    } catch (error) {}
  }
}
