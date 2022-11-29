/* eslint-disable */
import { Injectable } from '@angular/core';
import { McFilterSpec } from '@mc/common';

const FILTERS_SHORT_LIST = 'filtersShortList';

@Injectable({
  providedIn: 'root',
})
export class Mc2021FiltersShortListService {
  constructor() {}

  getShortList(filter: McFilterSpec) {
    const str = localStorage.getItem(FILTERS_SHORT_LIST) || '{}';
    const filtersShortList = JSON.parse(str);
    return filtersShortList && filtersShortList[filter.field];
  }

  setShortList(filter: McFilterSpec, shortList) {
    const filtersShortList = JSON.parse(localStorage.getItem(FILTERS_SHORT_LIST) || '{}');
    filtersShortList[filter.field] = shortList;
    localStorage.setItem(FILTERS_SHORT_LIST, JSON.stringify(filtersShortList));
  }
}
