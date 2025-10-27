import { Component, Input, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, UserData } from '../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
    
    @Input() open = false;

    @HostBinding('class.open') get isOpen() {
        return this.open;
    }

    username: string = '';
    email: string = '';

    private destroy$ = new Subject<void>();

    constructor(private authService: AuthService) {}

    /**
     * Subscribes to the Firebase auth user observable and reacts to changes.
     * The subscription is automatically torn down on component destroy via takeUntil.
     *
     * @returns void
     */
    ngOnInit(): void {
        this.authService.user$
            .pipe(takeUntil(this.destroy$))
            .subscribe(fbUser => {
                void this.handleUserChange(fbUser);
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Handle user changes: load Firestore data if available, otherwise fallback to Firebase user.
     *
     * @param fbUser - Firebase Auth user or null when logged out.
     * @returns Promise<void> - resolves when user data (or fallback) has been applied.
     */
    private async handleUserChange(fbUser: import('@angular/fire/auth').User | null): Promise<void> {
        if (!fbUser) {
            this.clearUser();
            return;
        }

        const userData: UserData | null = await this.authService.getUserDataFromFirestore(fbUser.uid);
        if (userData) {
            this.username = userData.userName;
            this.email = userData.email;
        } else {
            this.username = fbUser.displayName ?? '';
            this.email = fbUser.email ?? '';
        }
    }

    /**
     * Reset username/email to empty state.
     *
     * @returns void
     */
    private clearUser(): void {
        this.username = '';
        this.email = '';
    }

}
