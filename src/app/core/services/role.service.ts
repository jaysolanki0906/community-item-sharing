import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private roleSubject = new BehaviorSubject<string>('USER'); 
  public role$: Observable<string> = this.roleSubject.asObservable();

  
  setRole(role: string): void {
    this.roleSubject.next(role);
  }

  getRole(): string {
    return this.roleSubject.value;
  }
}