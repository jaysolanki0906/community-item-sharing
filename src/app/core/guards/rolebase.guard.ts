import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service'; 
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const rolebaseGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/not-authorized'], { skipLocationChange: true });
    return false;
  }

  return userService.getCurrentUser().pipe(
    switchMap(currentUser => 
      userService.getUserById(String(currentUser.id)).pipe(
        map(userFromList => {
          if (currentUser.role === 'ADMIN' && userFromList.isActive === true) {
            return true;
          } else {
            router.navigate(['/not-authorized'], { skipLocationChange: true });
            return false;
          }
        }),
        catchError(() => {
          router.navigate(['/not-authorized'], { skipLocationChange: true });
          return of(false);
        })
      )
    ),
    catchError(() => {
      router.navigate(['/not-authorized'], { skipLocationChange: true });
      return of(false);
    })
  );
};