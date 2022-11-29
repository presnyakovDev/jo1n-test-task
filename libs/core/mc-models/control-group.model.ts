/* eslint-disable */
export class McControlGroupTypeSpec {
  type: string;
  caption: string;
  headRole: string;

  constructor(item) {
    this.type = item.type;
    this.caption = item.caption || null;
    this.headRole = item.headRole || null;
  }
}

export class McControlGroup {
  id: number;
  manageType: string;
  groupName: string;
  defaultGroup: boolean;
  description: string;
  anonymous: boolean;
  status: string;
  objects: any[];

  public static getFieldNames() {
    return {
      caption: 'Name',
      description: 'Comments',
    };
  }

  constructor(item) {
    this.id = item.id;
    this.manageType = item.manageType;
    this.defaultGroup = item.defaultGroup || null;
    this.groupName = item.groupName || '';
    this.description = item.description || null;
    this.status = item.status || null;
    this.anonymous = item.anonymous || null;
    if (item.objects) {
      this.objects = item.objects;
    } else {
      this.objects = [];
    }
  }

  getTitle() {
    return this.groupName;
  }

  get caption(): string {
    return this.groupName;
  }

  getEditRoute() {
    return McControlGroup.getEditRouteById(this.manageType, this.id);
  }

  // tslint:disable-next-line:member-ordering
  public static getEditRouteById(manageType: string, id: number) {
    return ['/backoffice', 'control-groups', manageType, id];
  }

  // tslint:disable-next-line:member-ordering
  public static getGroupListRoute(manageType: string) {
    return ['/backoffice', 'control-groups', manageType];
  }

  // tslint:disable-next-line:member-ordering
  public static getListRoute(manageType: string) {
    return ['/backoffice', 'control-groups', manageType];
  }
}
