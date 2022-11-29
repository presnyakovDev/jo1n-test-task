/* eslint-disable */
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { McFilterSpec, McFilterValue } from '@mc/common';

import { Mc2021ListSettingsService } from '../../../settings.service';
import { Mc2021FiltersShortListService } from '../mc2021-filters-short-list.service';

const SHORT_LIST_LENGTH = 3;

@Component({
  selector: 'mc-2021-filter-item',
  templateUrl: './mc2021-filter-item.component.html',
  styleUrls: ['./mc2021-filter-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Mc2021FilterItemComponent implements OnInit {
  items: McFilterValue[] = [];
  listLength = SHORT_LIST_LENGTH;

  @Input() filter: McFilterSpec;
  @Input() settingsService: Mc2021ListSettingsService;

  constructor(private filtersShortListService: Mc2021FiltersShortListService) {}

  private shortListFirstSorter(items: McFilterValue[], shortList: string[]): McFilterValue[] {
    const itemsCopy = items.slice(0);
    const startArray = shortList.map(value => {
      const index = itemsCopy.findIndex(item => item.value === value);
      const [sortedItem] = index > -1 ? itemsCopy.splice(index, 1) : itemsCopy.splice(0, 1);

      return sortedItem;
    });

    return [...startArray, ...itemsCopy];
  }

  changeListLength() {
    this.listLength = this.listLength === SHORT_LIST_LENGTH ? this.items.length : SHORT_LIST_LENGTH;
  }

  async selectValue() {
    const result = await this.settingsService.selectSingleFilterVariant(this.filter);
    if (result) {
      this.filter.checkedValue = result;
    }
  }

  async removeValue() {
    this.settingsService.getFilters().delete(this.filter.field);
    this.settingsService.onFiltersChanged().next(null);
  }

  clearFilter() {
    this.filter.checkedValue = null;
  }

  async ngOnInit() {
    this.filter.checkedValue = this.filter.selectedValue;
    let items = typeof this.filter.getItems === 'function' ? await this.filter.getItems() : [];

    // TODO This condition must be removed when the custom filter is permanently removed
    if (this.filter.field === 'date') {
      items = items.filter(item => item.type !== 'custom');
      this.filter.checkedValue = items.find(item => item.value === this.filter.selectedValue.value) || null;
    }

    const shortList = this.filtersShortListService.getShortList(this.filter);

    if (shortList) {
      this.items = this.shortListFirstSorter(items, shortList);
    } else {
      this.items = items;
      const newShortList = this.items.slice(0, SHORT_LIST_LENGTH).map(({ value }) => value);
      this.filtersShortListService.setShortList(this.filter, newShortList);
    }
  }
}
