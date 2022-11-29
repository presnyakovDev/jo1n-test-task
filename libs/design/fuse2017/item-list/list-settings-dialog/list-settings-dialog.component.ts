/* eslint-disable */
import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { McListColumnSpec } from '../../../../common/models/item-list-specs.model';

@Component({
  selector: 'mc-list-settings-dialog',
  templateUrl: './list-settings-dialog.component.html',
  styleUrls: ['./list-settings-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class McListSettingsDialogComponent {
  selectedColumns: string[] = [];
  availableColumns: McListColumnSpec[] = [];
  dialogTitle: string;
  rightButtonText: string;
  dialogTitleTranslationKey: string;
  rightButtonTextTranslationKey: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<McListSettingsDialogComponent>
  ) {
    this.dialogTitle = this.data.dialogTitle ? this.data.dialogTitle : 'Настройка списка';
    this.rightButtonText = this.data.rightButtonText ? this.data.rightButtonText : 'Применить';
    this.selectedColumns = [...this.data.selectedColumns];
    this.availableColumns = this.data.availableColumns;

    this.dialogTitleTranslationKey = this.data.dialogTitleTranslationKey
      ? this.data.dialogTitleTranslationKey
      : 'COMMON.LIST_SETTINGS';
    this.rightButtonTextTranslationKey = this.data.rightButtonTextTranslationKey
      ? this.data.rightButtonTextTranslationKey
      : 'COMMON.APPLY';
  }

  changeValue(event, option) {
    if (event.checked) {
      return !this.selectedColumns.includes(option) && this.selectedColumns.push(option);
    }

    return (
      this.selectedColumns.includes(option) && this.selectedColumns.splice(this.selectedColumns.indexOf(option), 1)
    );
  }

  save() {
    const sortedSelectedColumns = this.availableColumns
      .filter(({ id }) => this.selectedColumns.includes(id))
      .map(({ id }) => id);

    this.dialogRef.close(sortedSelectedColumns);
  }

  close() {
    this.dialogRef.close();
  }
}
