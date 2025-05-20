import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

const ROLES_DATA = [
  {
    "title":"ADMIN",
    "auth_items": {
      "items": {
        "items_create": true,
        "items_edit": true,
        "items_delete": true,
        "items_view": true,
        "mark_interest": true,
        "view_interest": true
      },
      "manage_user": {
        "manage_user_view": true,
        "manage_user_edit": true,
        "mark_active": true,
        "mark_inactive": true
      },
      "user": {
        "user_create": true,
        "user_view": true,
        "user_edit": true,
        "user_delete": true,
        "user_resendPassword": true
      }
    }
  },
  {
    "title": "USER",
    "auth_items": {
      "items": {
        "items_create": true,
        "items_edit": true,
        "items_delete": false,
        "items_view": true,
        "mark_interest": true,
        "view_interest": false
      },
      "manage_user": {
        "manage_user_view": true,
        "manage_user_edit": false,
        "mark_active": false,
        "mark_inactive": false
      },
      "user": {
        "user_create": false,
        "user_view": true,
        "user_edit": true,
        "user_delete": false,
        "user_resendPassword": true
      }
    }
  },
  {
    "id": "c3e7cfd2-80e2-4916-91ee-6657f5b8d9e7",
    "org_id": "aca5341c-391d-44f8-bf6f-2ec8ee402c00",
    "title": "Guest",
    "auth_items": {
      "items": {
        "items_create": false,
        "items_edit": false,
        "items_delete": false,
        "items_view": true,
        "mark_interest": true,
        "view_interest": true
      },
      "manage_user": {
        "manage_user_view": false,
        "manage_user_edit": false,
        "mark_active": false,
        "mark_inactive": false
      },
      "user": {
        "user_create": false,
        "user_view": false,
        "user_edit": false,
        "user_delete": false,
        "user_resendPassword": false
      }
    }
  }
];

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
  private rolesArray: any[] = [];
  private rolesMap: any = {};
  private rolesSubject = new BehaviorSubject<any[]>([]);
  private currentRole: string = 'GUEST';
  public roleAuth: any = {}; // <-- Store current role's permissions here

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

    // Update roleAuth after loading roles
    this.updateRoleAuth();
  }

  setRoleFromStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentRole = (user.role || 'GUEST').toUpperCase();
      } catch {
        this.currentRole = 'GUEST';
      }
    } else {
      this.currentRole = 'GUEST';
    }
    this.updateRoleAuth();
  }

  updateRoleAuth() {
    this.roleAuth = this.rolesMap[this.currentRole] || {};
    // (Optional) Debug: console.log('roleAuth updated:', this.roleAuth);
  }

  getRoles() {
    return this.rolesArray;
  }

  addRole(role: any) {
    this.rolesArray.push(role);
    this.rolesMap[role.title.toUpperCase()] = role.auth_items;
    this.rolesSubject.next(this.rolesArray);
    this.updateRoleAuth();
  }

  deleteRole(index: number) {
    const [removed] = this.rolesArray.splice(index, 1);
    if (removed) delete this.rolesMap[removed.title.toUpperCase()];
    this.rolesSubject.next(this.rolesArray);
    this.updateRoleAuth();
  }

  getPermission(resource: string, action: string): boolean {
    // Use the stored roleAuth property for lookup
    return this.roleAuth[resource]?.[action] || false;
  }

  getRoles$() {
    return this.rolesSubject.asObservable();
  }
}