import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload['role'];
    
    if (role === 'Admin') {
      return true;
    }
    
    router.navigate(['/home']);
    return false;
  } catch (error) {
    router.navigate(['/login']);
    return false;
  }
};
