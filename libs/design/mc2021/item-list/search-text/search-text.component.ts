/* eslint-disable */
import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { fuseAnimations } from '@mc/core';
import { McItemListSpecs } from '@mc/common';
import { Mc2021ListSettingsService } from '../settings.service';

@Component({
  selector: 'mc-2021-item-list-search-text',
  templateUrl: './search-text.component.html',
  styleUrls: ['./search-text.component.scss'],
  animations: fuseAnimations,
})
export class Mc2021ItemListSearchTextComponent implements OnInit {
  searchText: FormControl;

  @Input() specs: McItemListSpecs;

  constructor(private settingsService: Mc2021ListSettingsService) {
    this.searchText = new FormControl(this.settingsService.getPage().searchText);
  }

  ngOnInit() {
    this.searchText.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(searchText => {
      this.settingsService.setSearchText(searchText);
      this.settingsService.onFiltersChanged().next(null);
    });
  }

  refresh() {
    this.searchText.patchValue('');
  }
}
