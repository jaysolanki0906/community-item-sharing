import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from './api-service.service';
import { Observable } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private api: ApiServiceService, private router: Router,private permissionsService: NgxPermissionsService) {}
setUserRole(role: string) {
  this.permissionsService.loadPermissions([role]); 
}

clearPermissions() {
  this.permissionsService.flushPermissions();
}
  login(credentials: { email: string; password: string }) {
    return this.api.post('auth/login', credentials);
  }

  isAuthorized(allowedRoles: string[]): boolean {
  const userRole = localStorage.getItem('role'); 

  return allowedRoles.includes(userRole || '');
}


  register(data: any) {
    return this.api.post('auth/register', data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

getAllUsers() {
  return this.api.get<any[]>('users');
}
getPaginatedUsers(page: number, limit: number): Observable<any> {
  return this.api.get<any>(`users?page=${page}&limit=${limit}`);
}

getUserById(id: string) {
  return this.api.get(`users/${id}`);
}

updateUser(id: string, data: any) {
  return this.api.patch(`users/${id}`, data);
}
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
  updateUserStatus(userId: number, isActive: boolean) {
    const url = `users/${userId}/status`;
    return this.api.patch(url, { isActive: isActive });
  }
  
}
