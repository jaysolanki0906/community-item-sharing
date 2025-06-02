import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TokenService {
  getAccessToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  saveTokens(access: string, refresh: string) {
    localStorage.setItem('token', access);
    localStorage.setItem('refreshToken', refresh);
  }

  clearTokens() {
    localStorage.clear();
  }
}
