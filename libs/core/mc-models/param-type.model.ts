/* eslint-disable */
import { ValueVariant } from './value-variant.model';

export class ParamType {
  id: number;
  manageType: string;
  code: string;
  caption: string;
  valueType: string;
  allowedValues: string;
  bankSelection: boolean;
  multiplicity: boolean;
  allowedValuesList: ValueVariant[];

  public static getFieldNames() {
    return {
      manageType: 'Тип',
      code: 'Код',
      caption: 'Наименование',
      valueType: 'Тип значения',
      allowedValues: 'Варианты для выбора',
      bankSelection: 'Возможен выбор банка',
      multiplicity: 'Множественное значение',
    };
  }

  constructor(item) {
    this.id = item.id;
    this.manageType = item.manageType || null;
    this.code = item.code || '';
    this.caption = item.caption || '';
    this.valueType = item.valueType || null;
    this.allowedValues = item.allowedValues || null;
    this.bankSelection = item.bankSelection || null;
    this.multiplicity = item.multiplicity || null;
    try {
      this.allowedValuesList = JSON.parse(this.allowedValues);
    } catch (e) {}
  }
}
