/* eslint-disable */
import { Component, Input } from '@angular/core';

import { fuseAnimations } from '@mc/core';
import { MatDialog } from '@angular/material/dialog';

import { Mc2021ListSettingsService } from '../settings.service';
import { Mc2021ListFiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { McItemListSpecs } from '@mc/common';

@Component({
  selector: 'mc-2021-item-list-filters-button',
  templateUrl: './filters-button.component.html',
  styleUrls: ['./filters-button.component.scss'],
  animations: fuseAnimations,
})
export class Mc2021ItemListFiltersButtonComponent {
  @Input() specs: McItemListSpecs;

  constructor(private dialog: MatDialog, private settingsService: Mc2021ListSettingsService) {}

  public onClick() {
    const dialogRef = this.dialog.open(Mc2021ListFiltersDialogComponent, {
      panelClass: 'mc-2021-list-filters-dialog',
      data: {
        settingsService: this.settingsService,
        specs: this.specs,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settingsService.onFiltersChanged().next(null);
      }
    });
  }
}
