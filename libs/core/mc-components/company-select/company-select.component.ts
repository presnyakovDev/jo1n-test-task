/* eslint-disable */
import { Component, Inject, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Subject } from 'rxjs';
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

import { fuseAnimations } from '../../animations';
import { FuseConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { McDataSource } from '../../mc-data-source';
import { Operator } from '../../mc-models/operator.model';
import { PageData } from '../../page-data.model';
import { Page } from '../../page.model';
import { CompaniesApiService } from '../../mc-services/companies-api.service';
import { Company } from '../../mc-models/company.model';

@Component({
  selector: 'mc-company-select',
  templateUrl: './company-select.component.html',
  styleUrls: ['./company-select.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [CompaniesApiService],
  animations: fuseAnimations,
})
export class McCompanySelectDialogComponent implements OnInit {
  displayedColumns = ['partnerCaption', 'inn'];

  dataSource: McDataSource;
  page = new Page();
  totalCount: number;

  title: string;
  confirmText: string;
  confirmNewText: string;
  confirmDropText: string;
  newTitle: string;
  advancedActions: number;
  canCreate: number;
  canDrop: number;

  searchInput: FormControl;
  statusFilter = '';
  filters: any[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  pageData = new PageData({ loading: true });
  onPageRequest = new Subject<Page>();
  onItemsDataChanged: BehaviorSubject<PageData> = new BehaviorSubject(new PageData({ loading: true }));
  onItemsChanged: BehaviorSubject<Operator[]> = new BehaviorSubject([]);

  constructor(
    private dialog: MatDialog,
    private itemsApiService: CompaniesApiService,
    public dialogRef: MatDialogRef<McCompanySelectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {
    this.searchInput = new FormControl('');
    this.page.pageSize = 5;

    this.title = data.title;
    this.confirmText = data.confirmText;
    this.confirmDropText = data.confirmDropText;
    this.confirmNewText = data.confirmNewText;
    this.newTitle = data.newTitle;

    this.canCreate = this.confirmNewText && this.newTitle ? 1 : 0;
    this.canDrop = this.confirmDropText ? 1 : 0;
    this.advancedActions = this.canCreate + this.canDrop;

    this.onItemsDataChanged.subscribe(itemsData => {
      this.pageData = itemsData;
      this.setItemsOnPageCount(itemsData.items ? itemsData.items.length : 0);
      this.onItemsChanged.next(itemsData.items);
    });
    this.onPageRequest
      .pipe(
        switchMap(page => {
          this.onItemsDataChanged.next(new PageData({ loading: true }));
          return this.itemsApiService.getItemsDataOnPage(page);
        })
      )
      .subscribe(itemsData => {
        this.onItemsDataChanged.next(itemsData);
      });
    this.dataSource = new McDataSource(this.onItemsChanged);
  }

  onSearchTextChange(searchText: string) {
    this.page.searchText = searchText;
    this.page.arrayFilters.set('docStatus', ['new', 'end']);
    this.page.pageNumber = 0;
    this.updatePage();
  }

  ngOnInit() {
    this.searchInput.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(searchText => {
      this.onSearchTextChange(searchText);
    });

    this.paginator.page.subscribe(page => {
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

  drop() {
    const confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false,
    });

    confirmDialogRef.componentInstance.confirmMessage = this.confirmDropText;

    confirmDialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      const item = new Company({ id: null });
      this.dialogRef.close({ selectedItem: item, new: false });
    });
  }

  create() {
    const confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false,
    });

    confirmDialogRef.componentInstance.confirmMessage = this.confirmNewText;

    confirmDialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      const item = new Company({ caption: this.newTitle });
      this.itemsApiService.update(item).then(result2 => {
        const newItemId = result2.id;
        item.id = newItemId;
        this.dialogRef.close({ selectedItem: item, new: true });
      });
    });
  }

  select(item: Company) {
    if (!this.confirmText) {
      this.dialogRef.close({ selectedItem: item, new: false });
      return;
    }

    const confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false,
    });

    confirmDialogRef.componentInstance.confirmMessage = this.confirmText.replace('@', item.getTitle());

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dialogRef.close({ selectedItem: item, new: false });
      }
    });
  }

  exit() {
    this.dialogRef.close();
  }
}
