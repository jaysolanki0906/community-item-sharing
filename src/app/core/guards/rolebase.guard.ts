import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { RolePermissionService } from '../services/role-permission.service';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || payload.sub || null;
  } catch {
    return null;
  }
}

export const rolebaseGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const rolePermissionService = inject(RolePermissionService);

  const token = localStorage.getItem('token');
  const userId = getUserIdFromToken();

  if (!token || !userId) {
    router.navigate(['/not-authorized'], { skipLocationChange: true });
    return false;
  }

  return userService.getUserById(userId).pipe(
    map(userFromList => {
      // Now check using rolePermissionService!
      const canManageUsers = rolePermissionService.getPermission('manage-user', 'users_manage');
      // Optionally, check isActive as well
      if (canManageUsers && userFromList.isActive === true) {
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
  );
};