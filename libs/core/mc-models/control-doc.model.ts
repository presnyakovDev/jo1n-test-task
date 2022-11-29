/* eslint-disable */
import { ValueVariant } from './value-variant.model';
import { ParamType } from './param-type.model';

export class ControlDoc {
  public static statusTitles = {
    NEW: 'BACKOFFICE.LIST.CONTROL_DOC.STATUSES.NEW',
    TPL: 'BACKOFFICE.LIST.CONTROL_DOC.STATUSES.TPL',
    ACTIVE: 'BACKOFFICE.LIST.CONTROL_DOC.STATUSES.ACTIVE',
    CANCEL: 'BACKOFFICE.LIST.CONTROL_DOC.STATUSES.CANCEL',
  };

  id: number;
  manageType: string;
  groupId: number;
  groupName: string;
  docStatus: string;
  docStatusCaption: string;
  dateFrom: string;
  dateTo: string;
  caption: string;
  description: string;
  parentId: number;
  parentCaption: string;
  brief: string;
  briefParts: string[];
  fullSpecs: string;
  fullSpecsWithParent: string;
  fullSpecsFromParent: string;
  version: number;
  createstamp: string;
  changestamp: string;
  createUsername: string;
  changeUsername: string;
  createUserFullname: string;
  changeUserFullname: string;

  scriptId: number;
  lines: ControlDocLine[];

  public static encodeStruct(data: any): string {
    if (!data) {
      return null;
    }
    if (data['inherit'] !== undefined || data['parentItem'] !== undefined) {
      const clearData = { ...data };
      clearData['inherit'] = undefined;
      clearData['parentItem'] = undefined;
      return JSON.stringify(clearData);
    }
    return JSON.stringify(data);
  }

  public static decodeStruct(data: string): any {
    if (!data) {
      return null;
    }
    // tslint:disable-next-line:quotemark
    const dataFixed = data.replace(new RegExp("'", 'g'), '"');
    return JSON.parse(dataFixed);
  }

  public static getFieldNames(personal: boolean) {
    return {
      docStatus: 'Статус',
      docStatusCaption: 'Статус',
      dateFrom: 'Дата начала действия',
      dateTo: 'Дата конца действия',
      caption: personal ? 'Пояснение' : 'Наименование',
      description: personal ? 'Комментарий' : 'Описание тарифа',
    };
  }

  public get active(): boolean {
    const activeStatuses = ['ACTIVE', 'TPL'];
    return activeStatuses.indexOf(this.docStatus) >= 0;
  }

  public get parentCode(): string {
    if (!this.parentCaption) {
      return '-';
    }
    const index = this.parentCaption.indexOf(':');
    return index > 0 ? this.parentCaption.slice(0, index) : this.parentCaption;
  }

  constructor(item) {
    this.id = item.id;
    this.version = item.version || 0;
    this.manageType = item.manageType || null;
    this.groupId = item.groupId || null;
    this.groupName = item.groupName || null;
    this.caption = item.caption || '';
    this.description = item.description || '';
    this.docStatus = item.docStatus || null;
    this.dateFrom = item.dateFrom || '';
    this.dateTo = item.dateTo || '';
    this.parentId = item.parentId || null;
    this.parentCaption = item.parentCaption || null;
    this.createstamp = item.createstamp || '';
    this.changestamp = item.changestamp || '';
    this.createUsername = item.createUsername || null;
    this.changeUsername = item.changeUsername || null;
    this.createUserFullname = item.createUserFullname || null;
    this.changeUserFullname = item.changeUserFullname || null;

    this.docStatusCaption = ControlDoc.statusTitles[this.docStatus]
      ? ControlDoc.statusTitles[this.docStatus]
      : this.docStatus;

    this.lines = item && item.lines ? item.lines.map(line => new ControlDocLine(line)) : [];
  }

  // tslint:disable-next-line:member-ordering
  static getEditRouteByIds(ownerType: string, ownerId: number, id: number, sourceId: number): any[] {
    return sourceId
      ? ['control-groups', ownerType, ownerId, 'doc', id, sourceId]
      : ['control-groups', ownerType, ownerId, 'doc', id];
  }

  fillMutliplicityKey() {
    this.lines.forEach((line, index) => {
      line.multiplicityKey = line.multiplicityKey || index.toString();
      line.canView = 'ROLE_MC_MANAGER_TERRITORY,ROLE_MC_MANAGER_BACKOFFICE';
    });
  }

  readOnly(): boolean {
    if (!this.id) {
      return false;
    }
    return this.docStatus === 'ACTIVE' || this.docStatus === 'CANCEL' || this.docStatus === 'TPL';
  }

  getEditRoute(): any[] {
    return ControlDoc.getEditRouteByIds(this.manageType, this.groupId, this.id || 0, null);
  }

  getCopyRoute(): any[] {
    return ControlDoc.getEditRouteByIds(this.manageType, this.groupId, 0, this.id || null);
  }

  public getParamField(paramTypes: Array<ParamType>, paramCode: string, field: string): any {
    const param = paramTypes.find(elem => elem.code === paramCode);
    if (!param) {
      return null;
    }

    const line = this.lines.find(elem => elem.paramId === param.id);
    if (!line) {
      return null;
    }
    return line[field];
  }

  public getParamFieldWithMultiplicityKey(
    paramTypes: Array<ParamType>,
    paramCode: string,
    multiplicityKey: string,
    field: string,
  ): any {
    const param = paramTypes.find(elem => {
      return elem.code === paramCode;
    });
    if (!param) {
      return null;
    }

    const line = this.lines.find(elem => {
      return elem.paramId === param.id && elem.multiplicityKey === multiplicityKey;
    });
    if (!line) {
      return null;
    }
    return line[field];
  }

  public getMonoParam(paramCode: string, field: string = 'value'): any {
    const line = this.lines.find(elem => {
      return elem.paramCode === paramCode;
    });
    if (!line) {
      return null;
    }
    return line[field];
  }

  public getLinesByParamCode(paramCode: string): Array<ControlDocLine> {
    const lines: Array<ControlDocLine> = [];

    this.lines.forEach((line, index) => {
      if (line.paramCode === paramCode) {
        lines.push(line);
      }
    });

    return lines;
  }

  public getParamByKey(paramCode: string, key: string, field: string = 'value'): any {
    const line = this.lines.find(elem => {
      return elem.paramCode === paramCode && elem.multiplicityKey === key;
    });
    if (!line) {
      return null;
    }
    return line[field];
  }

  public getUsedBankSubnets(paramCodes: string[]): Map<number, Set<number>> {
    const usedBankSubnets = new Map<number, Set<number>>();
    this.lines.forEach(line => {
      const separatorPos = line.paramCode.indexOf('@');
      if (line.bankId && separatorPos > 0) {
        const paramCode = line.paramCode.slice(0, separatorPos);
        const subnetId = +line.paramCode.slice(separatorPos + 1);
        if (paramCodes.includes(paramCode)) {
          if (!usedBankSubnets.has(line.bankId)) {
            usedBankSubnets.set(line.bankId, new Set<number>());
          }
          usedBankSubnets.get(line.bankId).add(subnetId);
        }
      }
    });
    return usedBankSubnets;
  }

  public getUsedBankIds(paramCodes: string[]) {
    const bankIds: number[] = [];
    this.lines.forEach(line => {
      if (line.bankId && paramCodes.includes(line.paramCode) && !bankIds.includes(line.bankId)) {
        bankIds.push(line.bankId);
      }
    });
    return bankIds;
  }

  public getParamByBankId(paramCode: string, bankId: number, field: string = 'value'): any {
    const line = this.lines.find(elem => {
      return elem.paramCode === paramCode && elem.bankId === bankId;
    });
    if (!line) {
      return null;
    }
    return line[field];
  }

  public setMonoParam(paramCode: string, field: string, value: any) {
    const existingLine = this.lines.find(elem => elem.paramCode === paramCode);
    if (existingLine) {
      existingLine[field] = value;
    } else {
      const newLine = new ControlDocLine({ paramCode: paramCode });
      newLine[field] = value;
      this.lines.push(newLine);
    }
  }

  public setParamByKey(paramCode: string, key: string, field: string, value: any) {
    const existingLine = this.lines.find(elem => elem.paramCode === paramCode && elem.multiplicityKey === key);
    if (existingLine) {
      existingLine[field] = value;
    } else {
      const newLine = new ControlDocLine({ paramCode: paramCode, multiplicityKey: key });
      newLine[field] = value;
      this.lines.push(newLine);
    }
  }

  public setParamByKeyAndBankId(paramCode: string, key: string, bankId: number, field: string, value: any) {
    const existingLine = this.lines.find(elem => elem.paramCode === paramCode && elem.multiplicityKey === key);
    if (existingLine) {
      existingLine[field] = value;
    } else {
      const newLine = new ControlDocLine({ paramCode: paramCode, multiplicityKey: key, bankId: '' + bankId });
      newLine[field] = value;
      this.lines.push(newLine);
    }
  }

  public setParamByBankId(paramCode: string, bankId: number, field: string, value: any) {
    const existingLine = this.lines.find(elem => elem.paramCode === paramCode && elem.bankId === bankId);
    if (existingLine) {
      existingLine[field] = value;
    } else {
      const newLine = new ControlDocLine({ paramCode: paramCode, bankId: bankId, multiplicityKey: '' + bankId });
      newLine[field] = value;
      this.lines.push(newLine);
    }
  }

  public getParamElem(paramCode: string, field: string = 'value'): any {
    const line = this.lines.find(elem => elem.paramCode === paramCode);
    if (!line) {
      return null;
    }
    return line[field];
  }

  public getParamElemWithMultiplicityKey(paramCode: string, multiplicityKey: string, field: string = 'value'): any {
    const line = this.lines.find(elem => {
      return elem.paramCode === paramCode && elem.multiplicityKey === multiplicityKey;
    });
    if (!line) {
      return null;
    }
    return line[field];
  }

  public getParamBankLine(paramCode: string, bankId: number): ControlDocLine {
    const line = this.lines.find(
      elem => elem.paramCode === paramCode && (elem.bankId === bankId || (!elem.bankId && !bankId)),
    );
    if (!line) {
      return null;
    }
    return line;
  }

  public getParamBankElem(paramCode: string, bankId: number, field: string): any {
    const line = this.lines.find(
      elem => elem.paramCode === paramCode && (elem.bankId === bankId || (!elem.bankId && !bankId)),
    );
    if (!line) {
      return null;
    }
    return line[field];
  }

  public removeParam(paramCode: string): any {
    this.lines = this.lines.filter(elem => elem.paramCode !== paramCode);
  }

  public getParamBankField(paramTypes: Array<ParamType>, paramCode: string, bankId: number, field: string): any {
    const param = paramTypes.find(elem => elem.code === paramCode);
    if (!param) {
      return null;
    }

    const line = this.lines.find(elem => elem.paramId === param.id && elem.bankId === bankId);
    if (!line) {
      return null;
    }
    return line[field];
  }

  public setParamField(paramTypes: Array<ParamType>, paramCode: string, field: string, value: any) {
    const param = paramTypes.find(elem => elem.code === paramCode);
    if (!param) {
      const errorText = 'No param "' + paramCode + '" found!';
      throw new Error(errorText);
    }

    const existingLine = this.lines.find(elem => elem.paramId === param.id);
    if (existingLine) {
      existingLine[field] = value;
      return;
    }

    const newLine = new ControlDocLine({ paramId: param.id, paramCode: paramCode });
    newLine[field] = value;
    this.lines.push(newLine);
  }

  public setParamFieldWithMultiplicityKey(
    paramTypes: Array<ParamType>,
    paramCode: string,
    multiplicityKey: string,
    field: string,
    value: any,
    bankId: number = null,
  ) {
    const param = paramTypes.find(elem => elem.code === paramCode);
    if (!param) {
      const errorText = 'No param "' + paramCode + '" found!';
      throw new Error(errorText);
    }

    const existingLine = this.lines.find(elem => {
      return elem.paramId === param.id && elem.multiplicityKey === multiplicityKey;
    });
    if (existingLine) {
      existingLine[field] = value;
      existingLine.bankId = bankId;
      return;
    }

    const newLine = new ControlDocLine({
      paramId: param.id,
      bankId: bankId,
      paramCode: paramCode,
      multiplicityKey: multiplicityKey,
    });
    newLine[field] = value;
    this.lines.push(newLine);
  }

  public setParamBankField(paramTypes: Array<ParamType>, paramCode: string, bankId: number, field: string, value: any) {
    const param = paramTypes.find(elem => elem.code === paramCode);
    if (!param) {
      const errorText = 'No param "' + paramCode + '" found!';
      throw new Error(errorText);
    }

    const existingLine = this.lines.find(elem => elem.paramId === param.id && elem.bankId === bankId);
    if (existingLine) {
      existingLine[field] = value;
      return;
    }

    const newLine = new ControlDocLine({
      paramId: param.id,
      bankId: bankId,
      multiplicityKey: '' + param.id + '/' + bankId,
    });
    newLine[field] = value;
    this.lines.push(newLine);
  }

  public setParamBankFieldWithBankMultiplicityKey(
    paramTypes: Array<ParamType>,
    paramCode: string,
    bankId: number,
    field: string,
    value: any,
  ) {
    const param = paramTypes.find(elem => elem.code === paramCode);
    if (!param) {
      const errorText = 'No param "' + paramCode + '" found!';
      throw new Error(errorText);
    }

    const existingLine = this.lines.find(elem => elem.paramId === param.id && elem.bankId === bankId);
    if (existingLine) {
      existingLine[field] = value;
      return;
    }

    const newLine = new ControlDocLine({ paramId: param.id, bankId: bankId, multiplicityKey: '' + bankId });
    newLine[field] = value;
    this.lines.push(newLine);
  }
}

export class ControlDocLine {
  active: boolean;
  paramId: number;
  paramCode: string;
  bankId: number;
  value: string;
  allowedValues: string;
  allowedValuesList: ValueVariant[];
  canView: string;
  canChange: string;
  description: string;
  scriptId: number;
  docId: number;
  multiplicityKey: string;

  fromParamMultiplicity: boolean;
  fromParamValueType: string;
  fromParamAllowedValues: string;

  public static getFieldNames() {
    return {
      bankId: 'Банк',
      paramId: 'Настройка',
      description: 'Описание настройки',
      value: 'Знач. по умолч.',
      allowedValues: 'Допуст. знач.',
      canView: 'Просмотр',
      canChange: 'Настройка',
    };
  }

  constructor(item) {
    this.active = true;
    this.paramId = item.paramId;
    this.paramCode = item.paramCode;
    this.bankId = item.bankId || null;
    this.value = item.value || null;
    this.allowedValues = item.allowedValues || null;
    this.canView = item.canView || null;
    this.canChange = item.canChange || null;
    this.description = item.description || null;
    this.multiplicityKey = item.multiplicityKey || null;
    try {
      this.allowedValuesList = JSON.parse(this.allowedValues);
    } catch (e) {}
  }
}
