/* eslint-disable */
import { DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject } from 'rxjs';

import { PageData } from './page-data.model';

export class McPageDataSource extends DataSource<any> {
  private onDataReceived: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(private itemsObservable: Observable<PageData>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any> {
    return this.itemsObservable;
  }

  disconnect() {}
}
