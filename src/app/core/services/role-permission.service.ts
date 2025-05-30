import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RolePermissionService {
  private baseUrl = '/api/roles'; // Adjust as needed
  public currentRole: string = 'USER';
  public roleAuth: any = {};

  constructor(private http: HttpClient) {}

  setRole(role: string, auth_items?: any): void {
    this.currentRole = (role || 'USER').toUpperCase();
    if (auth_items) {
      // If the backend returns auth_items.auth_items (as in your example):
      this.roleAuth = auth_items.auth_items || {};
    }
  }

  getPermission(module: string, permission: string): boolean {
    const permissions = this.generatePermissions(this.roleAuth);
    return permissions[module]?.includes(permission);
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createRole(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, payload, this.httpOptions());
  }

  updateRole(roleId: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${roleId}`, payload, this.httpOptions());
  }

  patchRole(roleId: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${roleId}`, payload, this.httpOptions());
  }

  deleteRole(roleId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${roleId}`, this.httpOptions());
  }

  setRoleAuth(authItems: any): void {
    this.roleAuth = authItems;
  }

  private generatePermissions(authItems: any): { [key: string]: string[] } {
    const permissions: { [key: string]: string[] } = {};
    for (const module of Object.keys(authItems || {})) {
      permissions[module] = [];
      for (const perm of Object.keys(authItems[module])) {
        if (authItems[module][perm] === true) {
          permissions[module].push(perm);
        }
      }
    }
    return permissions;
  }

  private httpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }
}