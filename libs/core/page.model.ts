/* eslint-disable */
export class Page {
  searchText = '';
  sortField = '';
  sortDirection = '';
  filters = new Map<string, string>();
  arrayFilters = new Map<string, string[]>();
  elemFilters = new Map<string, any>();

  public static getCopy(item): Page {
    const copy = new Page();
    copy.pageSize = item.pageSize;
    copy.pageNumber = item.pageNumber;
    copy.searchText = item.searchText;
    copy.sortField = item.sortField;
    copy.sortDirection = item.sortDirection;
    copy.filters = new Map<string, string>(item.filters);
    copy.arrayFilters = new Map<string, string[]>(item.arrayFilters);
    copy.elemFilters = new Map<string, any>(item.elemFilters);
    return copy;
  }

  // API default is 20
  constructor(public pageSize = 10, public pageNumber = 0) {}
}
