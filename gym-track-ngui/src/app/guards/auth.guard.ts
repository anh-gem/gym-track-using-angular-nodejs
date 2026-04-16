import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const isLoggedIn = document.cookie
    .split(';')
    .some((cookie) => cookie.trim().startsWith('loggedIn=true'));

  console.log('isLoggedIn:', isLoggedIn);

  if (isLoggedIn) {
    return true;
  }

  alert('Please login first');
  router.navigate(['/']);
  return false;
};
