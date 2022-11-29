/* eslint-disable */
import { Component, OnInit, EventEmitter, ViewEncapsulation, Output, Input } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { fuseAnimations } from '@mc/core';
import { McFilterSpec, McItemListSpecs } from '../../../../common/models/item-list-specs.model';

@Component({
  selector: 'mc-item-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class McItemListHeaderComponent implements OnInit {
  searchText: string;
  searchingText = new Subject<string>();

  @Input() set searchTextFromPage(text: string) {
    this.searchText = text;
  }
  @Input() specs: McItemListSpecs;
  @Output() onSetFilter = new EventEmitter<McFilterSpec>();
  @Output() onRemoveFilter = new EventEmitter<McFilterSpec>();
  @Output() onAddButtonClick = new EventEmitter<any>();
  @Output() onSearchChange = new EventEmitter<string>();
  @Output() onSettingsClick = new EventEmitter<any>();
  @Output() onExportToXlsClick = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {
    this.searchingText.pipe(debounceTime(300), distinctUntilChanged()).subscribe(searchText => {
      this.onSearchChange.emit(searchText);
    });
  }

  onSearchTextChange(text: string) {
    this.searchingText.next(text);
  }

  refresh() {
    this.searchText = '';
    this.onSearchTextChange(this.searchText);
  }

  exportToXLSClick() {
    this.onExportToXlsClick.emit();
  }

  settingsClick() {
    this.onSettingsClick.emit();
  }
  setFilter(filter: McFilterSpec) {
    this.onSetFilter.emit(filter);
  }
  removeFilter(filter: McFilterSpec) {
    this.onRemoveFilter.emit(filter);
  }
  addItem() {
    this.onAddButtonClick.emit();
  }
}
