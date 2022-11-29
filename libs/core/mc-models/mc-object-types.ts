/* eslint-disable */
export type McObjectsType = 'partners' | 'companies' | 'points' | 'operators';
export type McObjectsTypeExtended = 'groups' | 'personal-groups' | McObjectsType;

export class McObjectTypes {
  public static getCaption(objectType: McObjectsType): string {
    if (objectType === 'partners') {
      return 'Партнер';
    }
    if (objectType === 'companies') {
      return 'Юр. лицо';
    }
    if (objectType === 'points') {
      return 'Торг. точка';
    }
    if (objectType === 'operators') {
      return 'Оператор';
    }
    return '?';
  }

  public static getSingleItemCaption(objectType: McObjectsType): string {
    if (objectType === 'partners') {
      return 'partner';
    }
    if (objectType === 'companies') {
      return 'company';
    }
    if (objectType === 'points') {
      return 'point';
    }
    if (objectType === 'operators') {
      return 'operator';
    }
    return '?';
  }

  public static getObjectStruct(objectType: McObjectsType, objectId: number) {
    if (objectType === 'partners') {
      return { partnerId: objectId };
    }
    if (objectType === 'companies') {
      return { companyId: objectId };
    }
    if (objectType === 'points') {
      return { pointId: objectId };
    }
    if (objectType === 'operators') {
      return { operatorId: objectId };
    }
    return '?';
  }
}
