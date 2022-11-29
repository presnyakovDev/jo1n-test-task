/* eslint-disable */
import { Permission } from './permission.model';
import { Role } from './role.model';
import { CommonRolePermissions } from './common-role-permissions.model';

export class BoundedContext {
  name: string;
  code: string;
  permissions?: Permission[];
  roles?: Role[];
  commonRolesPermissions?: CommonRolePermissions[];
}
