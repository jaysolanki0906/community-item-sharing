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
  console.log('Stored role:', storedRole);
  console.log('Current role before setting:', this.currentRole);
  if (storedRole) {
    this.currentRole = storedRole.toUpperCase(); 
  } else {
    this.currentRole = 'USER'; 
  }
  console.log('Current role after setting:', this.currentRole);
  this.updateRoleAuth();
}


  updateRoleAuth() {
    this.roleAuth = this.rolesMap[this.currentRole] || {};
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
    return this.roleAuth[resource]?.[action] || false;
  }

  getRoles$() {
    return this.rolesSubject.asObservable();
  }
}