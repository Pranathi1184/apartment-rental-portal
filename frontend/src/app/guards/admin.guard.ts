import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }
  
  // If authenticated but not admin, maybe redirect to home?
  if (authService.isAuthenticated()) {
     return router.createUrlTree(['/']);
  }

  return router.createUrlTree(['/login']);
};
