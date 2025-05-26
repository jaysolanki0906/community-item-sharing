import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

const ROLES_DATA = [
  {
    "title": "ADMIN",
    "auth_items": {
      "items": {
        "items_create": true,
        "items_edit": true,
        "items_delete": true,
        "items_view": true,
        "mark_interest":true,
        "view_interest": true
      },
      "manage_user": {
        "manage_user_view": true,
        "manage_user_edit": true,
        "mark_active": true,
        "mark_inactive": true
      }
    }
  },
  {
    "title": "USER",
    "auth_items": {
      "items": {
        "items_create": false,
        "items_edit": true,
        "items_delete": false,
        "items_view": true,
        "mark_interest":true,
        "view_interest": false,
      },
      "manage_user": {
        "manage_user_view": true,
        "manage_user_edit": false,
        "mark_active": false,
        "mark_inactive": false
      },
      
    }
  }
];

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
  private rolesArray: any[] = [];
  private rolesMap: any = {};
  private rolesSubject = new BehaviorSubject<any[]>([]);
  private currentRole: string = 'USER';
  public roleAuth: any = {}; 

  constructor() {
    this.loadRoles();
    this.setRoleFromStorage();
  }

  loadRoles() {
    this.rolesArray = ROLES_DATA;
    this.rolesMap = {};
    for (const role of this.rolesArray) {
      this.rolesMap[role.title.toUpperCase()] = role.auth_items;
    }
    this.rolesSubject.next(this.rolesArray);
    this.updateRoleAuth();
  }

  setRoleFromStorage() {
  const storedRole = localStorage.getItem('role'); 
  if (storedRole) {
    this.currentRole = storedRole.toUpperCase(); 
  } else {
    this.currentRole = 'USER'; 
  }
  this.updateRoleAuth();
}

  updateRoleAuth() {
    this.roleAuth = this.rolesMap[this.currentRole] || {};
    const permissions = this.generatePermissions(this.roleAuth);
    localStorage.setItem('permissions', JSON.stringify(permissions));
  }

  getRoles() {
    return this.rolesArray;
  }

 getallRolesandpermission() {
    return this.rolesArray.map(role => ({
      title: role.title,
      auth_items: this.generatePermissions(role.auth_items)
    }));
 }

  private generatePermissions(authItems: any): { [key: string]: string[] } {
    const permissions: { [key: string]: string[] } = {};
    for (const module of Object.keys(authItems)) {
      permissions[module] = [];
      for (const perm of Object.keys(authItems[module])) {
        if (authItems[module][perm] === true) {
          permissions[module].push(perm);
        }
      }
    }
    return permissions;
  }

  getPermission(module: string, permission: string): boolean {
  const permissions = JSON.parse(localStorage.getItem('permissions') || '{}');
return permissions[module]?.includes(permission);
}
  getRoles$() {
    return this.rolesSubject.asObservable();
  }
}