/* eslint-disable */
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectorRef,
  AfterViewInit,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { moveItemInArray, CdkDragDrop } from '@angular/cdk/drag-drop';
import { takeUntil, first } from 'rxjs/operators';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';

import { fuseAnimations, Page, McUtils, FusePerfectScrollbarDirective } from '@mc/core';
import { McItemListSpecs, McListColumnSpec } from '@mc/common';

import { FuseNavbarVerticalService } from '../../../fuse2017/navbar/vertical/navbar-vertical.service';
import { Mc2021ListSettingsService } from '../settings.service';

@Component({
  selector: 'mc-2021-item-list-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: fuseAnimations,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Mc2021ItemListTableComponent implements OnInit, AfterViewInit {
  resizing$ = new Subject<boolean>();
  reordering$ = new Subject<boolean>();
  loading$ = new Subject<boolean>();
  error$ = new BehaviorSubject<string | null>(null);
  dataSource = [];
  navbar: any;
  rowWidth = 0;

  get page() {
    return this.settingsService.getPage();
  }
  get pageSize() {
    return this.settingsService.getPageSize();
  }
  get pageSizeOptions() {
    return this.settingsService.getPageSizeOptions();
  }
  get totalCount() {
    return this.settingsService.getTotalCount();
  }
  get pageIndex() {
    return this.settingsService.getPageNumber();
  }
  get displayedColumns() {
    const columns = this.settingsService.getDisplayedColumns();
    return this.specs.columns
      .filter(column => (columns ? columns.includes(column.id) : column.showByDefault))
      .map(column => column.id);
  }

  @Input() specs: McItemListSpecs;
  @Output() clickRow = new EventEmitter<any>();
  @Output() pageEvent = new EventEmitter<PageEvent>();
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('table', { read: MatSort, static: true }) sort: MatSort;

  constructor(
    private navbarService: FuseNavbarVerticalService,
    public settingsService: Mc2021ListSettingsService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.navbar = this.navbarService.getNavBar();
    this.paginator.page.subscribe(pageEvent => {
      this.pageEvent.next(pageEvent);
    });
  }

  ngAfterViewInit() {
    (<Promise<any>>this.specs.ready || <Promise<any>>Promise.resolve()).then(() => {
      this.updateColumnsWidthFromStorage();
      this.setRowWidth();
      this.restoreColumnsOrders();
    });
  }

  async updateItemsByPage(): Promise<any> {
    this.dataSource = [];
    this.error$.next(null);
    this.loading$.next(true);

    try {
      const items = await this.specs.getItemsOnPage(this.getPageForApi());
      this.dataSource = items;
      this.settingsService.setItemsOnPageCount(items.length);
    } catch (error) {
      this.error$.next(McUtils.getErrMsg(error)[0]);
    } finally {
      this.loading$.next(false);
    }
  }

  getPageForApi(): Page {
    const page = Page.getCopy(this.page);
    page.searchText = page.searchText.toUpperCase();
    page.filters.clear();
    this.specs.filters.forEach(filter => filter.applyToPage(page));

    return page;
  }

  getSafeStyle(style: string): SafeStyle {
    if (!style) {
      return null;
    }

    return this.sanitizer.bypassSecurityTrustStyle(style);
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
      JSON.stringify(this.specs.columns.map(item => item.id))
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
      }
    } catch (error) {}
  }

  async onClickRow(item: any) {
    this.clickRow.next(item);
  }
}
