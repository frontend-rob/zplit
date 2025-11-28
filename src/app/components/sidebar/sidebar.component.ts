import { Component, Input, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, UserData } from '../../core/services/auth.service';
import { LucideAngularModule, Gem, Zap, ContactRound, MessageCircleQuestionMark, Settings2, LogOut, } from 'lucide-angular';

@Component({
    selector: 'app-sidebar',
    imports: [
        CommonModule,
        LucideAngularModule
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {

    @Input() open = false;

    @HostBinding('class.open') get isOpen() {
        return this.open;
    }

    readonly Gem = Gem;
    readonly Zap = Zap;
    readonly ContactRound = ContactRound;
    readonly MessageCircleQuestionMark = MessageCircleQuestionMark;
    readonly Settings2 = Settings2;
    readonly LogOut = LogOut;

    username: string = '';
    email: string = '';

    private destroy$ = new Subject<void>();

    /**
     * Component constructor.
     *
     * @param authService - authentication service wrapper
     * @param router - Angular Router for navigation
     */
    constructor(private authService: AuthService, private router: Router) { }

    /**
     * Dynamic items for the sidebar.
     * - label: display text
     * - icon: reference to the icon field above
     * - route?: routerLink target
     * - action?: special action identifier (e.g. 'logout')
     */
    menuItems: Array<{ label: string; icon: any; route?: string; action?: string }> = [
        { label: 'Dashboard', icon: this.Gem, route: '/workspace' },
        { label: 'Zplits', icon: this.Zap, route: '/favorites' },
        { label: 'Contacts', icon: this.ContactRound, route: '/contacts' },
        { label: 'Help', icon: this.MessageCircleQuestionMark, route: '/help' },
        { label: 'Settings', icon: this.Settings2, route: '/settings' },
        { label: 'Log Out', icon: this.LogOut, action: 'logout' }
    ];

    /**
     * Subscribe to the Firebase auth user observable and react to changes.
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

    /**
     * Lifecycle hook: clean up subscriptions and other resources.
     *
     * @returns void
     */
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

    /**
     * Click handler for a sidebar item: navigates or executes actions.
     *
     * @param item - clicked sidebar item
     * @returns void
     */
    onItemClick(item: { label: string; icon: any; route?: string; action?: string }): void {
        if (item.action === 'logout') {
            void this.logOut();
            return;
        }
        
        if (item.route) {
            void this.router.navigate([item.route]);
        }
    }

    /**
     * trackBy function for ngFor to optimize re-rendering by using the item label as key.
    *
    * @param item - item to produce a tracking id for
    * @returns string - unique key for the item
    */
    trackByLabel(item: { label: string }): string {
        return item.label;
    }

    /**
     * Log the current user out and navigate to the root route.
     *
     * @returns Promise<void>
     */
    async logOut(): Promise<void> {
        await this.authService.logOut();
        await this.router.navigate(['']);
    }

}
