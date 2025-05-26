import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  const token = localStorage.getItem('token');
  const requestedUrl = state.url;
  const isActive = localStorage.getItem('isActive');

  if (requestedUrl.startsWith('/auth')) {
    if (token) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }

  if (!token) {
    router.navigate(['/login'],{ replaceUrl: true });
    return false;
  }

  const allowedRoles = route.data['roles'] as string[];

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (authService.isAuthorized(allowedRoles)) {
    return true;
  }

  router.navigate(['/not-authorized'],{ skipLocationChange: true });
  return false;
};