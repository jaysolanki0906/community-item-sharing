import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service'; // adjust path based on your project

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  const token = localStorage.getItem('token');
  const requestedUrl = state.url;

  const publicRoutes = ['/auth/login', '/auth/register'];


  if (publicRoutes.includes(requestedUrl)) {
    if (token) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }


  const allowedRoles = route.data['roles'] as string[];

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // if (authService.isAuthorized(allowedRoles)) {
  //   return true;
  // }

  
  router.navigate(['/unauthorized']); // Or fallback to /auth/login
  return false;
};
