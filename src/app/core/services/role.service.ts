import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roleSubject: BehaviorSubject<string>;

  public role$: Observable<string>;

  constructor() {
    const storedRole = localStorage.getItem('role') || 'USER';
    this.roleSubject = new BehaviorSubject<string>(storedRole);
    this.role$ = this.roleSubject.asObservable();
  }

  setRole(role: string): void {
    this.roleSubject.next(role);

  }

  getRole(): string {
    return this.roleSubject.value;
    
  }

  hasRole(): boolean {
    const role = this.getRole();
    return role !== null && role !== undefined && role !== '' && role !== 'USER';
  }

  clearRole(): void {
    this.roleSubject.next('USER');
  }
  getCurrentRole(): string {
  return this.getRole();
}
logCurrentRole(): void {
    console.log('Current role:', this.roleSubject.value);
  }

}
