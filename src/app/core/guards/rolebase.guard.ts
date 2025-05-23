import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const rolebaseGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token && role === 'ADMIN') {
    return true;
  }
  router.navigate(['/not-authorized']);
  return false;
};
