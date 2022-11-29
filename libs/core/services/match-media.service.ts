/* eslint-disable */
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class FuseMatchMedia {
  activeMediaQuery: string;
  onMediaChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(private observableMedia: MediaObserver) {
    this.activeMediaQuery = '';

    this.observableMedia.asObservable().subscribe((changes: MediaChange[]) => {
      changes.forEach(change => {
        if (this.activeMediaQuery !== change.mqAlias) {
          this.activeMediaQuery = change.mqAlias;
          this.onMediaChange.emit(change.mqAlias);
        }
      });
    });
  }
}
