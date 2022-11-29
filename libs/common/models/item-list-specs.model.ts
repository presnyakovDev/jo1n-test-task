/* eslint-disable */
import { ComponentFactory } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { McTranslatePropsOptions, McTranslateService, Page } from '@mc/core';
import { Selector } from '../selectors/selector';

export interface McItemListSpecs {
  itemsListType: string;
  caption: string;
  description?: string;
  freeTextQueryEnabled: boolean;
  freeTextQueryPlaceholder: string;
  freeTextQueryPlaceholderTranslateKey?: string;
  addItemEnabled: boolean;
  addItemDisableReason: string;
  addItemRoute: () => Array<string | number>;
  editItemRoute: (item: any) => Promise<Array<string | number>>;
  queryParams?: (item: any) => Promise<{ [field: string]: string | number }>;
  getItemsOnPage: (page: Page) => Promise<any[]>;
  rowStyle: (item: any) => string;
  filters: McFilterSpec[];
  columns: McListColumnSpec[];
  ready?: Promise<any>;
  customExportPrepare?: (items: any[]) => Promise<any[]>;
}

export interface McFilterSpec {
  // Название фильтра в левом меню
  caption: string;

  // По какому полю фильтровать список и под этим же полем будет сохранена настройка
  field: string;

  // Показывать ли фильтр на мобильных устройствах
  showIfMobile: boolean;

  // Запретить удаление фильтра
  disableClose: boolean;

  // Значение по умолчанию (обычно null)
  defaultValue: McFilterValue;

  // Выбранное и примененное значение фильтра в текущий момент
  selectedValue: McFilterValue;

  // Выбранное в диалоге, но пока не примененное значение фильтра
  checkedValue?: McFilterValue;

  // Заполнить значение selectedValue по сохраненному id McFilterValue
  fillSelectedValue: (value: any) => Promise<any>;

  // Спецификация селектора для выбора значения
  // Либо колбэк диалог выбора значения, по итогу если выбрано значение - вернуть его (не надо самостоятельно сохранять в selectedValue)
  selectVariant: Selector | SelectorCallback;

  // Установить значение фильтра для Page
  applyToPage: (page: Page) => any;

  // Скрытый фильтр
  hidden: boolean;

  // Показывать список вариантов
  showAsPresetsList?: boolean;

  // Список вариантов, нужен если showAsPresetsList true
  presets?: McFilterValue[];

  initTranslate?: (translate: McTranslateService, options?: McTranslatePropsOptions) => void;

  getItems?: () => Promise<McFilterValue[]>;
}

export class McFilterValue {
  value: any;
  caption: string;
  translationKey?: string;
  type?: string;
  hint?: string;
}

export class McDateFilterValue extends McFilterValue {
  type: string;
  from?: string;
  to?: string;
}

export class McListColumnSpec {
  translationKey?: string;
  id: string;
  caption: string;
  showByDefault: boolean;
  sort: boolean;
  columnStyle?: string;
  showIfMobile?: boolean;
  component?: (item: any, style?: string) => ComponentFactory<McColumnInterface>;
  content: (item: any) => any;
  width: number;
}

export interface McColumnInterface {
  item: any;
  style?: string;
}

export type SelectorCallback = (dialog: MatDialog) => Promise<McFilterValue>;
