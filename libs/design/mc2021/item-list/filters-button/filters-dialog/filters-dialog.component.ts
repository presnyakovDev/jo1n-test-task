/* eslint-disable */
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { McFilterSpec } from '@mc/common';
import { Mc2021ListSettingsService } from '../../settings.service';
import { Mc2021FiltersShortListService } from '@mc/design/mc2021/item-list/filters-button/filters-dialog/mc2021-filters-short-list.service';

@Component({
  selector: 'mc-2021-list-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Mc2021ListFiltersDialogComponent {
  dialogTitle: string;
  dialogTitleTranslationKey: string;
  filters: McFilterSpec[];
  private settingsService: Mc2021ListSettingsService;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<Mc2021ListFiltersDialogComponent>,
    private filtersShortListService: Mc2021FiltersShortListService
  ) {
    this.dialogTitle = this.data.dialogTitle ? this.data.dialogTitle : 'Фильтры';
    this.settingsService = this.data.settingsService;
    this.filters = this.data.specs.filters;
  }

  close() {
    this.dialogRef.close();
  }

  apply() {
    this.filters.forEach(filter => {
      filter.selectedValue = filter.checkedValue;
      if (!filter.checkedValue) {
        this.settingsService.getFilters().delete(filter.field);
      }
      this.setShortListForFilter(filter);
    });
    this.settingsService.onFiltersChanged().next(null);
    this.dialogRef.close();
  }

  private setShortListForFilter(filter) {
    if (!filter.checkedValue) {
      return;
    }

    this.settingsService.updatePageParams({ [filter.field]: filter.selectedValue.value });
    const shortList = this.filtersShortListService.getShortList(filter);

    if (shortList.includes(filter.checkedValue.value)) {
      shortList.sort(a => (a === filter.checkedValue.value ? -1 : 0));
    } else {
      shortList.unshift(filter.checkedValue.value);
      shortList.pop();
    }

    this.filtersShortListService.setShortList(filter, shortList);
  }
}
