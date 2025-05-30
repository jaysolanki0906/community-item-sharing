import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { UserService } from '../services/user.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  const userService = inject(UserService);
  const token = localStorage.getItem('token');
  const requestedUrl = state.url;

  if (!token) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  // Get the cached user (will be null if not loaded yet)
  let user = await firstValueFrom(userService.getCurrentUser());

  // If user is null (not loaded yet), try to fetch and store it ONCE
  if (!user) {
    try {
      user = await firstValueFrom(userService.fetchAndStoreCurrentUser());
    } catch {
      authService.logout();
      return false;
    }
  }

  // If user is inactive, log out
  if (user && user.is_active === false) {
    authService.logout();
    return false;
  }

  const allowedRoles = route.data['roles'] as string[];
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  // Use isAuthorized (returns Observable<boolean>)
  const authorized = await firstValueFrom(authService.isAuthorized(allowedRoles));
  if (authorized) {
    return true;
  }

  router.navigate(['/not-authorized'], { skipLocationChange: true });
  return false;
};