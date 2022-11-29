/* eslint-disable */
export class AccessGroup {
  id: number;
  groupName: string;
  accessRole: string;
  anonymous: boolean;
  users: any[];

  get caption(): string {
    return this.groupName;
  }

  constructor(item) {
    this.id = item.id;
    this.accessRole = item.accessRole;
    this.groupName = item.groupName || null;
    this.anonymous = item.anonymous || null;
    this.users = item.users;
  }
}
