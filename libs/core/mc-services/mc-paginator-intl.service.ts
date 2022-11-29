/* eslint-disable */
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Injectable } from '@angular/core';
import { McTranslateService } from './mc-translate.service';

@Injectable()
export class McPaginatorIntl extends MatPaginatorIntl {
  translate: McTranslateService;
  itemsPerPageLabel = 'Строк на странице: ';
  emptyLabel = '0 строк';
  rangeLabel = 'строки';

  constructor(translate: McTranslateService) {
    super();

    this.translate = translate;
    this.translate.onLangChange.subscribe(() => {
      this.translateLabels();
    });

    this.translateLabels();
  }

  getRangeLabel = function (page, pageSize, length) {
    if (!length || !pageSize) {
      return this.emptyLabel;
    }

    length = Math.max(length, 0);
    const startIndex = page * pageSize; // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${this.rangeLabel} ${startIndex + 1} - ${endIndex}`;
  };

  translateLabels() {
    this.itemsPerPageLabel = this.translate.instant('COMMON.PAGINATOR.ITEMS_PER_PAGE');
    this.emptyLabel = this.translate.instant('COMMON.PAGINATOR.EMPTY_LABEL');
    this.rangeLabel = this.translate.instant('COMMON.PAGINATOR.RANGE_LABEL');
    this.changes.next(null);
  }
}
