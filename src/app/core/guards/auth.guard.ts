import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

/**
 * Guard to protect routes from unauthorized access.
 * Redirects to the start page if the user is not authenticated.
 */
export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    return authService.user$.pipe(
        map(user => {
            if (user) return true;
            router.navigate(['']);
            return false;
        })
    );
};
