import { EventEmitter, Injectable, Type } from '@angular/core';
import { McObjectsType } from '@mc/core';

export interface BackofficeTab {
  type: McObjectsType;
  code: string;
  caption: string;
  labelTranslationKey?: string;
}

export interface BackofficeObjectForm {
  partnerId: number;
  companyId: number;
  pointId: number;
  operatorId?: number;
  onFormSaved: EventEmitter<any>;
}
export interface BackofficeForm {
  type: McObjectsType;
  processCode: string;
  component: Type<BackofficeObjectForm>;
}

@Injectable()
export class BackofficeConfigService {
  private static defaultProcessCode: string;

  private static fields = new Map<string, any>();

  private static companyCodeTranslationKey = 'BACKOFFICE.SUMMARY.INN';

  private static partnerManagerAccountRequiredList = ['sign', 'codes', 'active'];

  private static tabs: BackofficeTab[] = [];

  private static forms = new Map<string, BackofficeForm>();

  public registerPartnerManagerAccountRequiredCodeList(codes: string[]) {
    BackofficeConfigService.partnerManagerAccountRequiredList = codes;
  }

  public setCompanyCodeTranslationKey(key: string) {
    BackofficeConfigService.companyCodeTranslationKey = key;
  }

  public getCompanyCodeTranslationKey(): string {
    return BackofficeConfigService.companyCodeTranslationKey;
  }

  public partnerManagerAccountRequired(code: string) {
    return BackofficeConfigService.partnerManagerAccountRequiredList.includes(code);
  }

  public registerTab(tab: BackofficeTab) {
    BackofficeConfigService.tabs.push(tab);
  }

  public registerFields(code: string, objectType: McObjectsType, objectFields: any) {
    BackofficeConfigService.fields.set(objectType + '.' + code, objectFields);
  }

  public getFields(code: string, objectType: McObjectsType): any {
    return BackofficeConfigService.fields.get(objectType + '.' + code);
  }

  public getTabs(objectType: McObjectsType) {
    return BackofficeConfigService.tabs
      .filter(tab => tab.type === objectType)
      .map(tab => ({
        label: tab.caption,
        tab: tab.code,
        labelTranslationKey: tab.labelTranslationKey,
      }));
  }

  public registerForm(form: BackofficeForm) {
    BackofficeConfigService.forms.set(form.type + '.' + form.processCode, form);
  }

  public getForm(objectType: McObjectsType, processCode: string) {
    return BackofficeConfigService.forms.get(objectType + '.' + processCode);
  }

  public setDefaultProcessCode(code: string) {
    BackofficeConfigService.defaultProcessCode = code;
  }

  public getDefaultProcessCode(): string {
    return BackofficeConfigService.defaultProcessCode;
  }
}
