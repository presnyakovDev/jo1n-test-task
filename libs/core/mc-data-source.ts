/* eslint-disable */
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs';

export class McDataSource extends DataSource<any> {
  constructor(private itemsObservable: Observable<any>) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any> {
    return this.itemsObservable;
  }

  disconnect() {}
}
