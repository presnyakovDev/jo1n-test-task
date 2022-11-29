/* eslint-disable */
import { AnonymousAccessGroup } from './anonymos-access-group.model';
import { EmailTemplate } from './email-template.model';

export class User {
  email: string;
  enabled: boolean;
  firstname: string;
  lastname: string;
  phone: string;
  roles: string[];
  secondname: string;
  username: string;

  constructor(item: any) {
    this.email = item.email || null;
    this.firstname = item.firstname || null;
    this.lastname = item.lastname || null;
    this.phone = item.phone || null;
    this.secondname = item.secondname || null;
    this.username = item.username || null;
    this.enabled = item.enabled || null;
    this.roles = this.roles || null;
  }
}

export class UserCreateRequest {
  anonymousAccessGroup: AnonymousAccessGroup;
  email: string;
  emailTemplate: EmailTemplate;
  firstname: string;
  lastname: string;
  loginMode: number;
  loginNum: number;
  password: string;
  phone: string;
  secondname: string;
  username: string;
  enabled: boolean;
  roles: string[];
}
