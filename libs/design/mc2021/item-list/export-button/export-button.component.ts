/* eslint-disable */
import { Component, Input } from '@angular/core';

import { fuseAnimations, McAlertService, McTranslateService, Page, ReportsCommon } from '@mc/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { Mc2021ListSettingsDialogComponent } from '../settings-button/settings-dialog/settings-dialog.component';
import { Mc2021ListSettingsService } from '../settings.service';
import { McItemListSpecs } from '@mc/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mc-2021-item-list-export-button',
  templateUrl: './export-button.component.html',
  styleUrls: ['./export-button.component.scss'],
  animations: fuseAnimations,
})
export class Mc2021ItemListExportButtonComponent {
  @BlockUI() blockUI: NgBlockUI;
  @Input() specs: McItemListSpecs;

  indexAmount: number;

  get printedColumns() {
    const columns = this.settingsService.getPrintedColumns();
    return this.specs.columns
      .filter(column => (columns ? columns.includes(column.id) : column.showByDefault))
      .map(column => column.id);
  }

  constructor(
    private dialog: MatDialog,
    private alertService: McAlertService,
    private translationService: McTranslateService,
    private settingsService: Mc2021ListSettingsService,
    private translateService: TranslateService,
  ) {}

  public onClick() {
    const dialogRef = this.dialog.open(Mc2021ListSettingsDialogComponent, {
      panelClass: 'mc-2021-list-settings-dialog',
      data: {
        dialogTitle: 'Download to XLS settings',
        rightButtonText: 'Download to XLS',
        availableColumns: this.specs.columns,
        selectedColumns: this.printedColumns,
        dialogTitleTranslationKey: 'COMMON.XLS_SETTINGS',
        rightButtonTextTranslationKey: 'COMMON.XLS_ACTION',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settingsService.setPrintedColumns(result);
        this.exportToXLS();
      }
    });
  }

  private async exportToXLS() {
    const listType = this.specs.itemsListType;
    const filename = `${listType}.xlsx`;
    const page = this.getPageForApi();
    page.pageNumber = 0;
    page.pageSize = 100;

    this.blockUI.start(this.translateService.instant('COMMON.LOADING_'));
    this.getItemsOnPagesFrom(page)
      .then(items => {
        this.blockUI.stop();
        const colsForXls = this.specs.columns.filter(column => this.printedColumns.indexOf(column.id) !== -1);
        const reportData = this.prepareExcelData(items, colsForXls).map((report, n) => {
          return report.map((repo, i) => {
            if (repo === 'Loan amount requested') {
              this.indexAmount = i;
            }
            if (i === this.indexAmount && n !== 0) {
              return repo + '€';
            } else {
              return repo;
            }
          });
        });
        ReportsCommon.saveReport(
          reportData,
          filename,
          this.translateService.instant('BACKOFFICE.ACTIONS.DETALIZATION'),
        );
      })
      .catch(reason => {
        this.blockUI.stop();
        this.alertService.alertReason('Error', reason);
      });
  }

  private prepareExcelData(items, columns) {
    const cols = columns;
    return [
      cols.map(col => (col.translationKey ? this.translationService.instant(col.translationKey) : col.caption)),
      ...items.map(item => cols.map(col => col.content(item))),
    ];
  }

  private getItemsOnPagesFrom(page: Page): Promise<Array<any>> {
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

  private getPageForApi(): Page {
    const page = Page.getCopy(this.settingsService.getPage());
    page.filters.clear();
    this.specs.filters.forEach(filter => filter.applyToPage(page));

    return page;
  }
}
