// src/app/core/services/role-permission.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RolePermissionService {
  // Global roles array object
  public roles: any[] = [];

  constructor() {}

  // Set roles globally
  setRoles(data: any[]) {
    this.roles = data;
  }

  // Get roles
  getRoles(): any[] {
    return this.roles;
  }

  // Get specific role by index
  getRole(index: number): any {
    return this.roles[index];
  }

  // Update role
  updateRole(index: number, updatedRole: any) {
    this.roles[index] = updatedRole;
  }

  // Add new role
  addRole(newRole: any) {
    this.roles.push(newRole);
  }

  // Delete role
  deleteRole(index: number) {
    this.roles.splice(index, 1);
  }
}
