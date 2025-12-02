import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService, UserData } from '../../core/services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    
    greeting$: Observable<string>;
    username$: Observable<string>;

    /**
     * Constructs the DashboardService and wires up the observable pipelines.
     * Note: Observables are lazy — no async work runs until a subscription occurs.
     *
     * @param authService - AuthService used to read the current auth user and Firestore profile
     */
    constructor(private authService: AuthService) {
        this.greeting$ = this.buildGreeting$();
        this.username$ = this.buildUsername$();
    }

    /**
     * Build greeting observable (single synchronous emission).
     *
     * @returns Observable<string> that emits the current greeting and completes.
     */
    private buildGreeting$(): Observable<string> {
        return new Observable<string>(subscriber => {
            subscriber.next(this.getGreetingTime());
            subscriber.complete();
        });
    }

    /**
     * Build username observable by mapping the auth user to a displayable name.
     * This method converts the Promise returned by getUserDataFromFirestore into an observable
     * and applies a compact mapping + fallback strategy.
     *
     * @returns Observable<string> emitting the user's first name or an empty string.
     */
    private buildUsername$(): Observable<string> {
        return this.authService.user$.pipe(
            switchMap((u: any) => {
                if (!u) return of('');

                return from(this.authService.getUserDataFromFirestore(u.uid)).pipe(
                    map((fs: UserData | null) =>
                        fs?.userName
                            ? this.extractFirstName(fs.userName)
                            : this.extractFirstName(u.displayName ?? u.email ?? '')
                    ),
                    catchError(() => of(this.extractFirstName(u.displayName ?? u.email ?? '')))
                );
            })
        );
    }

    /**
     * Returns a greeting string depending on the current hour.
     *
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