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
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.userSubject.next(JSON.parse(userJson));
    }
  }

  fetchAndStoreCurrentUser(): Observable<User> {
    return this.api.get<User>('auth/user_info').pipe(
      tap(user => {
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      shareReplay(1)
    );
  }

  getCurrentUser(): Observable<User | null> {
    if (this.userSubject.value) {
      return of(this.userSubject.value);
    } else {
      return this.fetchAndStoreCurrentUser();
    }
  }

  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');
  }

  getUserById(id: string): Observable<User> {
    return this.api.get<User>(`users/${id}`).pipe(
      map(apiUser => ({
        ...apiUser,
        is_active: apiUser.is_active
      }))
    );
  }
}
