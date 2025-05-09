import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from './api-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private api: ApiServiceService, private router: Router) {}

  login(credentials: { email: string; password: string }) {
    return this.api.post('auth/login', credentials);
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
