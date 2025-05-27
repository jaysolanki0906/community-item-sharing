import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from './api-service.service';
import { Observable, map } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
import { User } from '../models/user.model';
import { LoginResponse } from '../models/login-response.model';

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

  refreshToken(): Observable<any> {
    return this.api.post('/api/refresh-token', {});
  }

  clearPermissions() {
    this.permissionsService.flushPermissions();
    localStorage.removeItem('role');
  }

  login(data: { email: string; password: string }): Observable<LoginResponse> {
  return this.api.post<LoginResponse>('auth/login', data).pipe(
    map((response: LoginResponse) => {
      // Access role like this:
      if (response && response.data && response.data.role) {
        // Use response.data.role as needed
        this.permissionsService.loadPermissions([response.data.role]);
      }
      return response;
    })
  );
}

  // Fetch current user's role from the API
  getCurrentUserRole(): Observable<string> {
    return this.api.get<User>('users/me').pipe(
      map((user: User) => user.role || 'USER')
    );
  }

  isAuthorized(allowedRoles: string[]): Observable<boolean> {
    // Now checks via API, not localStorage
    return this.getCurrentUserRole().pipe(
      map(role => allowedRoles.includes(role.toUpperCase()))
    );
  }

  register(data: any) {
    return this.api.post('auth/register', data);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.clearPermissions();
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