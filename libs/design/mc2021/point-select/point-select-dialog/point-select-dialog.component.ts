/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OperatorCommonApiService } from '@mc/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'mc-2021-point-select-dialog',
  templateUrl: './point-select-dialog.component.html',
  styleUrls: ['./point-select-dialog.component.scss'],
})
export class Mc2021PointSelectDialogComponent implements OnInit {
  @BlockUI()
  public blockUI: NgBlockUI;

  public points: any;

  constructor(
    private operatorCommonApiService: OperatorCommonApiService,
    public dialogRef: MatDialogRef<Mc2021PointSelectDialogComponent>
  ) {}

  public async ngOnInit(): Promise<void> {
    this.blockUI.start();
    this.points = await this.operatorCommonApiService.getPoints();
    this.blockUI.stop();
  }

  public onChangeStateSelect() {
    this.dialogRef.close();
  }
}
