/* eslint-disable */
import { Component, ViewEncapsulation, Input, OnDestroy } from '@angular/core';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { Subject, interval } from 'rxjs';

import { ProcessStatus } from '@mc/core';

@Component({
  selector: 'mc-process-spinner',
  templateUrl: './process-spinner.component.html',
  styleUrls: ['./process-spinner.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class McProcessSpinnerComponent implements OnDestroy {
  @Input() firstLoadText = 'Загрузка...';
  @Input() waitTimerText = 'Подождите ещё..';
  @Input() waitWithoutTimerText = 'Идёт опрос банков...';
  @Input() doneText = 'Опрос банков завершен';

  @Input() processStatus = new ProcessStatus();

  @Input() set timerSeconds(value: number) {
    if (value) {
      this.initLoadTimer(value);
    }
  }

  loadTimer: number;
  loadTimerMin: string;
  loadTimerSec: string;

  private _onDestroy = new Subject<void>();

  constructor() {}

  ngOnDestroy() {
    this._onDestroy.next(null);
    this._onDestroy.complete();
  }

  initLoadTimer(value: number) {
    this.loadTimer = value;

    interval(1000)
      .pipe(takeWhile(() => !this.processStatus.finished && this.loadTimer > 0))
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.updateLoadTimer();
      });
  }

  updateLoadTimer() {
    this.loadTimer -= 1;
    this.loadTimerMin = '' + Math.floor(this.loadTimer / 60);
    this.loadTimerSec = '' + (this.loadTimer % 60);
    if (this.loadTimerSec.length === 1) {
      this.loadTimerSec = 0 + this.loadTimerSec;
    }
  }
}
