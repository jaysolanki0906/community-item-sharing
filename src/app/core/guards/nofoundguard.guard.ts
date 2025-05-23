import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const nofoundguardGuard: CanActivateFn = (route, state) => {
   const router = inject(Router);
   const token = localStorage.getItem('token');
   if(token)
   {
     router.navigate(['/not-found'], { skipLocationChange: true });
   }
   else
   {
      router.navigate(['/login']);
   }
  return false;
};
