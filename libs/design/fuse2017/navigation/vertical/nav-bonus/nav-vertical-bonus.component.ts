/* eslint-disable */
import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { McAlertService } from '../../../../../core/mc-services/alert.service';
import { McAuthService } from '../../../../../core/mc-services/auth.service';

@Component({
  selector: 'mc-nav-vertical-bonus',
  templateUrl: './nav-vertical-bonus.component.html',
  styleUrls: ['./nav-vertical-bonus.component.scss'],
})
export class McNavVerticalBonusComponent implements OnInit {
  @HostBinding('class') classes = 'nav-item';
  @Input() item: any;

  constructor(private alert: McAlertService, private auth: McAuthService) {}

  closeBtn() {
    this.alert.alert({
      title: 'Скрыть начисления?',
      content: ['ВНИМАНИЕ! Включить отображение начислений можно будет в разделе "Агентское вознаграждение"'],
      confirmAction: () => {
        this.doClose();
      },
    });
  }

  doClose() {
    this.auth.storeFeatureRole('FEATURE_AV_WIDGET', false);
  }

  ngOnInit() {}
}
