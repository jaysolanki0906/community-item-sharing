import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserService } from "./user.service"; // <-- Make sure this path is correct

const ROLES_DATA = [
  {
    "title": "ADMIN",
    "auth_items": {
      "items": {
        "items_create": true,
        "items_edit": true,
        "items_delete": true,
        "items_view": true,
        "mark_interest": true,
        "view_interest": true
      },
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
        "mark_interest": false,
        "view_interest": false,
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

  constructor(private userService: UserService) {
    this.loadRoles();
    this.setRoleFromApi();
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

  setRole(role: string) {
    this.currentRole = (role || 'USER').toUpperCase();
    this.updateRoleAuth();
  }

  setRoleFromApi() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.setRole(user.role);
      },
      error: () => {
        this.setRole('USER');
      }
    });
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
    const permissions = this.generatePermissions(this.roleAuth);
    return permissions[module]?.includes(permission);
  }

  getRoles$() {
    return this.rolesSubject.asObservable();
  }
}