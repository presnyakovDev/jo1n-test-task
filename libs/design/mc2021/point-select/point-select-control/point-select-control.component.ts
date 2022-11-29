/* eslint-disable */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { McAlertService, McAppInfoService, OperatorCommonApiService } from '@mc/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'mc-2021-point-select-control',
  templateUrl: './point-select-control.component.html',
  styleUrls: ['./point-select-control.component.scss'],
})
export class PointSelectControlComponent implements OnInit {
  @Input()
  public points: any;

  @Output()
  public onChangeStateSelect = new EventEmitter();

  @BlockUI()
  public blockUI: NgBlockUI;

  public searchControl: FormControl = new FormControl('');

  public items: any;

  constructor(
    private operatorCommonApiService: OperatorCommonApiService,
    private appInfo: McAppInfoService,
    private alertService: McAlertService,
  ) {}

  public async ngOnInit(): Promise<void> {
    this.items = this.points;
    this.searchControl.valueChanges.subscribe((searchString: string) => {
      this.items = this.points.filter(point => {
        const caption = `${point.caption} ${point.companyCaption}`.toLocaleLowerCase();
        return caption.includes(searchString.toLocaleLowerCase());
      });
    });
  }

  public async onSelectPoint(point) {
    this.blockUI.start();

    try {
      await this.operatorCommonApiService.setPoint(point.id);
      this.appInfo.setPointId(point.id);
    } catch (reason) {
      this.alertService.alertReason('ERROR', reason);
    } finally {
      this.onChangeStateSelect.emit();
      this.blockUI.stop();
    }
  }
}
