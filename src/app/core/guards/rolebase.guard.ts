import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const rolebaseGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isActive = localStorage.getItem('isActive');

  if (token && role === 'ADMIN'&& isActive === 'true') {
    return true;
  }
  router.navigate(['/not-authorized'],{ skipLocationChange: true });
  return false;
};
