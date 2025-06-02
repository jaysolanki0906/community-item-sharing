import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { RoleService } from '../services/role.service';
import { RolePermissionService } from '../services/role-permission.service';
import { of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userService = inject(UserService);
  const roleService = inject(RoleService);
  const rolePermissionService = inject(RolePermissionService);
  const token = localStorage.getItem('token');

  if (!token) {
    // Not logged in, allow access to login page
    return true;
  }

  // If token present, fetch user and set roles, then redirect
  return userService.fetchAndStoreCurrentUser().pipe(
    tap({
      next: (user) => {
        roleService.setRole(user.role);
        rolePermissionService.setRole(user.role, user.auth_items);
        router.navigate(['/dashboard']);
      },
      error: () => {
        roleService.setRole('USER');
        rolePermissionService.setRole('USER', {});
        router.navigate(['/dashboard']);
      }
    }),
    map(() => false), 
    catchError(() => {
      roleService.setRole('USER');
      rolePermissionService.setRole('USER', {});
      router.navigate(['/dashboard']);
      return of(false);
    })
  );
};