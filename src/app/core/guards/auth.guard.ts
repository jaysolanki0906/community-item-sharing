import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { UserService } from '../services/user.service';
import { RolePermissionService } from '../services/role-permission.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const authService = inject(AuthServiceService);
  const userService = inject(UserService);
  const rolePermissionService = inject(RolePermissionService); // <-- inject permission service
  const token = localStorage.getItem('token');
  const requestedUrl = state.url;

  if (!token) {
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
  let user = await firstValueFrom(userService.getCurrentUser());

  if (!user) {
    try {
      user = await firstValueFrom(userService.fetchAndStoreCurrentUser());
    } catch {
      authService.logout();
      return false;
    }
  }

  if (user && user.is_active === false) {
    authService.logout();
    return false;
  }

  const allowedRoles = route.data['roles'] as string[];
  if (allowedRoles && allowedRoles.length > 0) {
    const authorized = await firstValueFrom(authService.isAuthorized(allowedRoles));
    if (!authorized) {
      router.navigate(['/not-authorized'], { skipLocationChange: true });
      return false;
    }
  }

  const requiredPermissions = route.data['permissions'] as { module: string, permission: string }[];
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every(req =>
      rolePermissionService.getPermission(req.module, req.permission)
    );
    if (!hasPermission) {
      router.navigate(['/not-authorized'], { skipLocationChange: true });
      return false;
    }
  }

  return true;
};