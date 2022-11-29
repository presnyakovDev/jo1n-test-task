/* eslint-disable */
import { Component, Input } from '@angular/core';

import { fuseAnimations, McShowInfoDialogComponent } from '@mc/core';
import { McItemListSpecs, McFilterSpec, McFilterValue } from '@mc/common';
import { Mc2021ListSettingsService } from '../settings.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'mc-2021-item-list-tabs-line',
  templateUrl: './tabs-line.component.html',
  styleUrls: ['./tabs-line.component.scss'],
  animations: fuseAnimations,
})
export class Mc2021ItemListTabsLineComponent {
  @Input() specs: McItemListSpecs;

  constructor(private dialog: MatDialog, private settingsService: Mc2021ListSettingsService) {}

  async onClickFilter(filter: McFilterSpec) {
    const result = await this.settingsService.selectSingleFilterVariant(filter);
    if (result) {
      this.settingsService.updatePageParams({ [filter.field]: result.value });
      this.settingsService.onFiltersChanged().next(null);
    }
  }

  async showTip(item: McFilterValue) {
    this.dialog.open(McShowInfoDialogComponent, {
      panelClass: 'show-info-dialog',
      data: {
        title: 'Вкладка "' + item.caption + '"',
        htmlContent: item.hint,
      },
    });
  }
}
