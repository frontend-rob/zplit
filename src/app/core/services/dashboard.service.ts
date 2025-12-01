import { Injectable } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService, UserData } from '../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    greeting$: Observable<string>;
    username$: Observable<string>;

    /**
     * Constructs the DashboardService.
     * @param authService - the AuthService used to read the current auth user and optional Firestore data
     */
    constructor(private authService: AuthService) {
        
        this.greeting$ = of(this.getGreetingTime());

        // username$ reagiert auf den Firebase-User und liest optional Firestore-Daten (Promise -> from)
        this.username$ = this.authService.user$.pipe(
            switchMap((u: any) => {
                if (!u) return of('');
                return from(this.authService.getUserDataFromFirestore(u.uid)).pipe(
                    map((fs: UserData | null) => {
                        if (fs?.userName) return this.extractFirstName(fs.userName);
                        return this.extractFirstName(u.displayName ?? u.email ?? '');
                    }),
                    catchError(() => of(this.extractFirstName(u.displayName ?? u.email ?? '')))
                );
            })
        );
    }

    /**
     * Returns a greeting string depending on the current hour.
     * @returns a greeting like 'Good morning', 'Good day' or 'Good evening'
     */
    private getGreetingTime(): string {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Good morning';
        if (hour >= 12 && hour < 18) return 'Good day';
        return 'Good evening';
    }

    /**
     * Extracts a first name or sensible short identifier from various possible inputs.
     * Handles strings (including emails) and object shapes commonly returned by providers.
     *
     * @param u - input which may be a string (displayName/email) or an object with name fields
     * @returns the extracted first name or an empty string if none could be determined
     */
    private extractFirstName(u: any): string {
        if (!u) return '';
        if (typeof u === 'string') {
            if (u.includes('@')) {
                return u.split('@')[0].split(/[.\-_]/)[0] || '';
            }
            return u.split(' ')[0] || '';
        }
        const possible = (u.firstName ?? u.firstname ?? u.name ?? u.displayName ?? u.fullName ?? u.username ?? '').toString();
        if (possible) return possible.split(' ')[0];
        if (u.profile && typeof u.profile.name === 'string') {
            return u.profile.name.split(' ')[0] || '';
        }
        return '';
    }
}