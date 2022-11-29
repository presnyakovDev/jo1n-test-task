/* eslint-disable */
import { Component, EventEmitter, Output, Input } from '@angular/core';

import { fuseAnimations } from '@mc/core';
import { McFilterSpec } from '@mc/common';

@Component({
  selector: 'mc-2021-item-list-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  animations: fuseAnimations,
})
export class Mc2021ItemListFilterComponent {
  @Input() filter: McFilterSpec;
  @Output() removeFilter = new EventEmitter();
  @Output() setFilter = new EventEmitter();

  constructor() {}

  onClickFilter() {
    this.setFilter.emit();
  }
  onRemoveFilter() {
    this.removeFilter.emit();
  }
}
