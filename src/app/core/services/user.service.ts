import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiServiceService } from './api-service.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiServiceService) {}

  getCurrentUser(): Observable<User> {
    return this.api.get<User>('users/me');
  }
  getUserById(id: string): Observable<User> {
    return this.api.get<User>(`users/${id}`);
  }
}