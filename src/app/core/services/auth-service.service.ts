import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from './api-service.service';
import { Observable } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { User } from '../models/user.model';

// Use PascalCase and ensure it's at the top level
type Credentials = { email: string; password: string };

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(
    private api: ApiServiceService,
    private router: Router,
    private permissionsService: NgxPermissionsService
  ) {}

  setUserRole(role: string) {
    localStorage.setItem('role', role);
    this.permissionsService.loadPermissions([role]);
  }

  clearPermissions() {
    this.permissionsService.flushPermissions();
    localStorage.removeItem('role');
  }

  login(credentials: Credentials) {
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
    localStorage.removeItem('role');
    this.clearPermissions();
    console.log('Logging out');
    this.router.navigate(['login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getAllUsers() {
    return this.api.get<User[]>('users');
  }

  getPaginatedUsers(page: number, limit: number): Observable<{ data: User[], total: number }> {
    return this.api.get<{ data: User[], total: number }>(`users?page=${page}&limit=${limit}`);
  }

  getUserById(id: string): Observable<User> {
    return this.api.get<User>(`users/${id}`);
  }

  updateUser(id: string, data: Partial<User>) {
    return this.api.patch<User>(`users/${id}`, data);
  }

  updateUserStatus(userId: number, isActive: boolean) {
    const url = `users/${userId}/status`;
    return this.api.patch(url, { isActive });
  }

}