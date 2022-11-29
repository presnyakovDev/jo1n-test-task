/* eslint-disable */
import { Component, Inject, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { fuseAnimations, McDataSource, PageData, Page, McTranslateService } from '@mc/core';
import { Selector } from '@mc/common/selectors/selector';
import { McFilterValue } from '@mc/common';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'fuse-item-select-dialog',
  templateUrl: './item-select-dialog.component.html',
  styleUrls: ['./item-select-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FuseItemSelectDialogComponent implements OnInit {
  displayedColumns = ['caption'];
  closeButtonTitle = 'Close';

  dataSource: McDataSource;
  items: McFilterValue[] = [];
  page = new Page();
  totalCount: number;

  searchInput: FormControl;
  statusFilter = '';
  filters: any[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  pageData = new PageData({ loading: true });
  onPageRequest = new Subject<Page>();
  onItemsDataChanged: BehaviorSubject<PageData> = new BehaviorSubject(new PageData({ loading: true }));
  onItemsChanged: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor(
    private translate: McTranslateService,
    public dialogRef: MatDialogRef<FuseItemSelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public selector: Selector,
  ) {
    this.searchInput = new FormControl('');
    this.page.pageSize = selector.pageSize;

    this.onItemsDataChanged.pipe(untilDestroyed(this)).subscribe(itemsData => {
      this.pageData = itemsData;
      this.setItemsOnPageCount(itemsData.items ? itemsData.items.length : 0);
      this.items = itemsData.items;

      this.onItemsChanged.next(this.items);
    });
    this.onPageRequest
      .pipe(
        switchMap(page => {
          this.onItemsDataChanged.next(new PageData({ loading: true }));
          return this.selector.getItemsDataOnPage(page);
        }),
        untilDestroyed(this),
      )
      .subscribe(itemsData => {
        this.onItemsDataChanged.next(itemsData);
      });
    this.dataSource = new McDataSource(this.onItemsChanged);

    const options = {
      translatableProperties: {
        'COMMON.CLOSE': 'closeButtonTitle',
      },
      translatableArrayProperties: [
        {
          name: 'items',
          translationKey: 'translationKey',
          translatableKey: 'caption',
        },
      ],
      afterTranslateCallback: () => this.onItemsChanged.next(this.items),
    };

    this.translate.translateProps(this, options);
  }

  onSearchTextChange(searchText: string) {
    this.page.searchText = searchText;
    this.page.arrayFilters.set('docStatus', ['new', 'end']);
    this.page.pageNumber = 0;
    this.updatePage();
  }

  ngOnInit() {
    this.searchInput.valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this)).subscribe(searchText => {
      this.onSearchTextChange(searchText);
    });

    this.paginator.page.pipe(untilDestroyed(this)).subscribe(page => {
      this.page.pageNumber = page.pageIndex;
      this.updatePage();
    });

    this.updatePage();
  }

  updatePage() {
    this.onPageRequest.next(this.page);
  }

  setItemsOnPageCount(itemsOnPageCount: number) {
    const offset = this.page.pageNumber * this.page.pageSize;
    const nextPageAvailable = itemsOnPageCount < this.page.pageSize ? 0 : 1;

    this.totalCount = offset + itemsOnPageCount + nextPageAvailable;
  }

  getTotalCount() {
    return this.totalCount;
  }
  getPageSize() {
    return this.page.pageSize;
  }
  getPageNumber() {
    return this.page.pageNumber;
  }

  select(item: any) {
    this.dialogRef.close(item);
  }

  exit() {
    this.dialogRef.close();
  }
}
