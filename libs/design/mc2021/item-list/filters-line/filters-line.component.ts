/* eslint-disable */
import { Component, Input } from '@angular/core';

import { fuseAnimations } from '@mc/core';
import { McItemListSpecs, McFilterSpec } from '@mc/common';
import { Mc2021ListSettingsService } from '../settings.service';

@Component({
  selector: 'mc-2021-item-list-filters-line',
  templateUrl: './filters-line.component.html',
  styleUrls: ['./filters-line.component.scss'],
  animations: fuseAnimations,
})
export class Mc2021ItemListFiltersLineComponent {
  @Input() specs: McItemListSpecs;

  get canDropAllFilters(): boolean {
    return !!this.specs.filters.find(filter => filter.selectedValue && !filter.disableClose);
  }

  constructor(private settingsService: Mc2021ListSettingsService) {}

  dropAllFilters() {
    const filtersToDrop = this.specs.filters.filter(filter => !filter.disableClose);
    filtersToDrop.forEach(filter => this.settingsService.getFilters().delete(filter.field));
    this.settingsService.onFiltersChanged().next(null);
  }

  async onClickFilter(filter: McFilterSpec) {
    const result = await this.settingsService.selectSingleFilterVariant(filter);
    if (result) {
      this.settingsService.updatePageParams({ [filter.field]: result.value });
      this.settingsService.onFiltersChanged().next(null);
    }
  }

  onRemoveFilter(filter: McFilterSpec) {
    this.settingsService.getFilters().delete(filter.field);
    this.settingsService.onFiltersChanged().next(null);
  }
}
