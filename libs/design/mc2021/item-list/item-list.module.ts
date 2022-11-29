/* eslint-disable */
import { NgModule } from '@angular/core';

import { SharedModule } from '@mc/core';
import { Mc2021ItemListComponent } from './item-list.component';
import { Mc2021ItemListFiltersLineComponent } from './filters-line/filters-line.component';
import { Mc2021ListSettingsDialogComponent } from './settings-button/settings-dialog/settings-dialog.component';
import { Mc2021ItemListCustomCellComponent } from './table/custom-cell/custom-cell.component';
import { Mc2021ItemListTableComponent } from './table/table.component';
import { Mc2021ItemListTabsLineComponent } from './tabs-line/tabs-line.component';
import { Mc2021ItemListFilterComponent } from './filters-button/filters-dialog/filter/filter.component';
import { Mc2021ListFiltersDialogComponent } from './filters-button/filters-dialog/filters-dialog.component';
import { Mc2021ItemListExportButtonComponent } from './export-button/export-button.component';
import { Mc2021ItemListSettingsButtonComponent } from './settings-button/settings-button.component';
import { Mc2021ItemListFiltersButtonComponent } from './filters-button/filters-button.component';
import { Mc2021ItemListAddButtonComponent } from './add-button/add-button.component';
import { Mc2021ItemListSearchTextComponent } from './search-text/search-text.component';
import { Mc2021FilterItemComponent } from './filters-button/filters-dialog/filter-item/mc2021-filter-item.component';
import { Mc2021FiltersShortListService } from './filters-button/filters-dialog/mc2021-filters-short-list.service';
import { Mc2021ListSettingsService } from './settings.service';

@NgModule({
  declarations: [
    Mc2021ItemListComponent,
    Mc2021ItemListTabsLineComponent,
    Mc2021ItemListFiltersLineComponent,
    Mc2021ListSettingsDialogComponent,
    Mc2021ItemListCustomCellComponent,
    Mc2021ItemListTableComponent,
    Mc2021ItemListFilterComponent,
    Mc2021ListFiltersDialogComponent,
    Mc2021ItemListExportButtonComponent,
    Mc2021ItemListSettingsButtonComponent,
    Mc2021ItemListFiltersButtonComponent,
    Mc2021ItemListAddButtonComponent,
    Mc2021ItemListSearchTextComponent,
    Mc2021FilterItemComponent,
  ],
  imports: [SharedModule],
  providers: [Mc2021FiltersShortListService],
  exports: [Mc2021ItemListComponent],
})
export class Mc2021ItemListModule {}
