import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, shareReplay } from 'rxjs/operators';
import { ApiServiceService } from './api-service.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private api: ApiServiceService) {
    // Optionally restore from localStorage on init
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.userSubject.next(JSON.parse(userJson));
    }
  }

  /** Fetch user info from API and store in BehaviorSubject and localStorage */
  fetchAndStoreCurrentUser(): Observable<User> {
    return this.api.get<any>('auth/user_info').pipe(
      map(apiUser => ({
        ...apiUser,
        isActive: apiUser.is_active // map snake_case to camelCase
      })),
      tap(user => {
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      shareReplay(1)
    );
  }

  getCurrentUser(): Observable<User | null> {
    return this.user$;
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  getUserById(id: string): Observable<User> {
    return this.api.get<any>(`users/${id}`).pipe(
      map(apiUser => ({
        ...apiUser,
        isActive: apiUser.is_active 
      }))
    );
  }
}