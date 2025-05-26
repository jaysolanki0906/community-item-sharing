// src/app/core/guards/nofoundguard.guard.ts
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const nofoundguardGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);

  // Instead of just returning a URL Tree, navigate with replaceUrl to clear history and then return false to block the route.
  router.navigate(['/not-found'], { replaceUrl: true });
  return false;  // block activation of wildcard route itself
};
