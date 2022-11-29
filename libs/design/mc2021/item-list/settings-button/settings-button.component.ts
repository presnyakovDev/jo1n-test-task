/* eslint-disable */
import { Component, Input } from '@angular/core';

import { fuseAnimations } from '@mc/core';
import { MatDialog } from '@angular/material/dialog';

import { Mc2021ListSettingsDialogComponent } from './settings-dialog/settings-dialog.component';
import { Mc2021ListSettingsService } from '../settings.service';
import { McItemListSpecs } from '@mc/common';

@Component({
  selector: 'mc-2021-item-list-settings-button',
  templateUrl: './settings-button.component.html',
  styleUrls: ['./settings-button.component.scss'],
  animations: fuseAnimations,
})
export class Mc2021ItemListSettingsButtonComponent {
  @Input() specs: McItemListSpecs;

  constructor(private dialog: MatDialog, private settingsService: Mc2021ListSettingsService) {}

  public onClick() {
    const columns = this.settingsService.getDisplayedColumns();
    const dialogRef = this.dialog.open(Mc2021ListSettingsDialogComponent, {
      panelClass: 'mc-2021-list-settings-dialog',
      data: {
        availableColumns: this.specs.columns,
        selectedColumns: columns
          ? columns
          : this.specs.columns.filter(column => column.showByDefault).map(column => column.id),
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.settingsService.setDisplayedColumns(result);
        this.settingsService.onColumnsChanged().next(null);
      }
    });
  }
}
