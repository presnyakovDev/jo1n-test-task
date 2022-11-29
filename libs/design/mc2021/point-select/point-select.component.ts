/* eslint-disable */
import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OperatorApiService, OperatorCommonApiService } from '@mc/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Mc2021PointSelectDialogComponent } from './point-select-dialog';

@Component({
  selector: 'mc-2021-point-select',
  templateUrl: './point-select.component.html',
  styleUrls: ['./point-select.component.scss'],
})
export class Mc2021PointSelectComponent implements OnInit {
  @BlockUI()
  public blockUI: NgBlockUI;

  @Input()
  public companyCaption: string;

  @Input()
  public pointCaption: string;

  @HostListener('document:click', ['$event'])
  public clickOutside(event: { target: EventTarget }) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpenedSelect = false;
    }
  }

  public isOpenedSelect = false;

  public points: any[];

  constructor(
    private eRef: ElementRef,
    private operatorCommonApiService: OperatorCommonApiService,
    private dialog: MatDialog
  ) {}

  public async ngOnInit(): Promise<void> {
    this.operatorCommonApiService.getItem().then(operator => {
      if (operator?.requestPointChange) {
        this.dialog.open(Mc2021PointSelectDialogComponent, {
          disableClose: true,
          maxWidth: '600px',
          width: '100%',
        });
      }
    });

    this.points = await this.operatorCommonApiService.getPoints();
  }

  public onChangeStateSelect() {
    this.isOpenedSelect = !this.isOpenedSelect;
  }
}
