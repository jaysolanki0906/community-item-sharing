import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const requestedUrl = state.url;

  const publicRoutes = ['/auth/login', '/auth/register'];
  if (token) {
    if (publicRoutes.includes(requestedUrl)) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }

  if (publicRoutes.includes(requestedUrl)) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
