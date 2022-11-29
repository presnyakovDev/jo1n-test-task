/* eslint-disable */
import { Component, EventEmitter, Output, Input, ViewEncapsulation } from '@angular/core';

import { fuseAnimations, Page } from '@mc/core';
import { McItemListSpecs, McFilterSpec } from '../../../../common/models/item-list-specs.model';

@Component({
  selector: 'mc-item-list-sidenav',
  templateUrl: './list-sidenav.component.html',
  styleUrls: ['./list-sidenav.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class McItemListSidenavComponent {
  @Input() specs: McItemListSpecs;
  @Input() itemsTitle = '';
  @Input() itemsDescription = '';
  @Output() onAddButtonClick = new EventEmitter<any>();
  @Output() onRemoveFilter = new EventEmitter<McFilterSpec>();
  @Output() onSetFilter = new EventEmitter<McFilterSpec>();

  constructor() {}

  setFilter(filter: McFilterSpec) {
    this.onSetFilter.emit(filter);
  }
  removeFilter(filter: McFilterSpec) {
    this.onRemoveFilter.emit(filter);
  }
  addItem() {
    this.onAddButtonClick.emit();
  }

  checkboxClick(filter: McFilterSpec) {
    event.preventDefault();
    this.setFilter(filter);
  }
}
