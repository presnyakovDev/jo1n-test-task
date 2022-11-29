/* eslint-disable */
import { MatSortable } from '@angular/material/sort';

import { Page } from './page.model';

export class McSort implements MatSortable {
  id: string;
  start: 'asc' | 'desc';
  disableClear: boolean;

  constructor(page: Page) {
    {
      if (page.sortField !== '' && page.sortDirection !== '') {
        this.id = page.sortField;
        this.start = page.sortDirection === 'desc' ? 'desc' : 'asc';
      }

      this.disableClear = false;
    }
  }
}
