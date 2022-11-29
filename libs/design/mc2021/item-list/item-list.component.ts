/* eslint-disable */
import { Component, OnInit, ViewChild, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

import { McAppInfoService } from '@mc/core';
import { McItemListSpecs } from '@mc/common';

import { Mc2021ItemListTableComponent } from './table/table.component';
import { Mc2021ListSettingsService } from './settings.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'mc-2021-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [Mc2021ListSettingsService],
})
export class Mc2021ItemListComponent implements OnInit {
  pageParamsUpdated$ = new Subject<boolean>();

  _specs: McItemListSpecs;
  @Input() set specs(value: McItemListSpecs) {
    this._specs = value;
    this.settingsService.setSpecs(value);
  }
  get specs(): McItemListSpecs {
    return this._specs;
  }

  @Input() customExport = false;

  @Output() onCustomExport = new EventEmitter<void>();

  @ViewChild('table', { static: true }) table: Mc2021ItemListTableComponent;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public settingsService: Mc2021ListSettingsService,
    private appInfo: McAppInfoService,
  ) {
    this.settingsService.onColumnsChanged().subscribe(() => {
      this.table.setRowWidth();
    });
  }

  onPageEvent(page: PageEvent) {
    const pageIndex = +page.pageSize === +this.settingsService.getPageSize() ? page.pageIndex : 0;
    this.settingsService.setPageSize(page.pageSize);
    this.onPageUpdate(pageIndex);
  }

  ngOnInit() {
    this.settingsService.setDialog(this.dialog);

    setTimeout(() => this.appInfo.setTitle(this.specs.caption), 1);

    this.route.queryParams.subscribe(async params => {
      if (params.default === 'true') {
        this.settingsService.clearPage();
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

      this.settingsService.updatePageParams(params);
      await this.updateSelectedValuesByPageFilters();
      this.table.updateItemsByPage();
      this.pageParamsUpdated$.next(true);
    });

    this.settingsService.onFiltersChanged().subscribe(() => {
      this.onPageUpdate();
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
    const page = this.settingsService.getPage();
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
    const filters = this.settingsService.getFilters();

    await Promise.all(this.specs.filters.map(filter => filter.fillSelectedValue(filters.get(filter.field))));
  }

  storePageParams() {
    const obj = this.getPageParams();
    localStorage.setItem(this.specs.itemsListType + 'ItemListSettings', JSON.stringify(obj));
  }

  onPageUpdate(pageIndex: number = 0) {
    this.settingsService.setPageNumber(pageIndex);
    this.storePageParams();
    this.navigateByPageParams();
  }

  async onEditItem(item: any) {
    const itemRoute = await this.specs.editItemRoute(item);
    const queryParams = Boolean(this.specs.queryParams) ? await this.specs.queryParams(item) : {};
    this.router.navigate(itemRoute, { queryParams: queryParams });
  }
}
