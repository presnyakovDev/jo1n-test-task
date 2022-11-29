/* eslint-disable */
import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { McShowInfoDialogComponent } from '@mc/core';
import { BankCodeItem } from './bank-code-array.model';

@Component({
  selector: 'mc-partner-bank-code-item',
  templateUrl: './bank-code.component.html',
  styleUrls: ['./bank-code.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class McPartnerBankCodesItemComponent implements OnInit {
  @Input()
  public code: BankCodeItem;

  public status = '';

  public color = '';

  constructor(private dialog: MatDialog) {}

  public ngOnInit() {
    const { status, color } = this.getStatus(this.code);
    this.status = status;
    this.color = color;
  }

  public showTip() {
    this.dialog.open(McShowInfoDialogComponent, {
      panelClass: 'show-info-dialog',
      data: {
        title: 'Подсказка',
        htmlContent: `
        <p>
          Заполните/проверьте заполнение
            <a href="/personal-settings/anket" target="_blank">анкеты оператора</a>
          и обратитесь к своему менеджеру МС для получения авторизации
        </p>`,
        accent: true,
      },
    });
  }

  public getStatus(code: BankCodeItem) {
    if (code?.code) {
      return {
        status: 'Авторизован',
        color: 'var(--success-color)',
      };
    }
    if (code?.disableReason) {
      return {
        status: 'Заблокирован',
        color: 'var(--warn-color)',
      };
    }
    if (code?.firstSendDate) {
      return {
        status: 'Запрошена',
        color: 'var(--primary-color)',
      };
    }
    return {
      status: 'Не запрашивали',
      color: 'var(--primary-light-color)',
    };
  }
}
