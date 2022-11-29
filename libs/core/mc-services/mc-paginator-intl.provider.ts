/* eslint-disable */
import { McPaginatorIntl } from './mc-paginator-intl.service';
import { McTranslateService } from './mc-translate.service';
import { MatPaginatorIntl } from '@angular/material/paginator';

const mcPaginatorIntlFactory = (translate: McTranslateService) => {
  return new McPaginatorIntl(translate);
};

export const mcPaginatorIntlProvider = {
  provide: MatPaginatorIntl,
  useFactory: mcPaginatorIntlFactory,
  deps: [McTranslateService],
};
