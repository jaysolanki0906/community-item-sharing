import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const homeguardGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const userService = inject(UserService);

  return userService.getCurrentUser().pipe(
    map(user => {
      if (user && user.role) {
        return ['ADMIN', 'USER'].includes(user.role.toUpperCase());
      }
      return false;
    })
  );
};
