import { Component, Input, HostBinding, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService, UserData } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';
import { LucideAngularModule, Gem, Zap, ContactRound, MessageCircleQuestionMark, Settings2, LogOut, } from 'lucide-angular';

@Component({
    selector: 'app-sidebar',
    imports: [
        RouterLink,
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
    constructor(private authService: AuthService, private router: Router, private sidebarService: SidebarService) { }

    /**
     * Dynamic items for the sidebar.
     * - label: display text
     * - icon: reference to the icon field above
     * - route?: routerLink target
     * - action?: special action identifier (e.g. 'logout')
     */
    menuItems: Array<{ label: string; icon: any; route?: string; action?: string; active?: boolean }> = [
        { label: 'Dashboard', icon: this.Gem, route: '/workspace/dashboard', active: false },
        { label: 'Zplits', icon: this.Zap, route: '/workspace/zplits', active: false },
        { label: 'Contacts', icon: this.ContactRound, route: '/workspace/contacts', active: false },
        { label: 'Help', icon: this.MessageCircleQuestionMark, route: '/workspace/help', active: false },
        { label: 'Settings', icon: this.Settings2, route: '/workspace/settings', active: false },
        { label: 'Log Out', icon: this.LogOut, action: 'logout', active: false }
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

        // initial und nach Navigationsereignissen aktiv setzen
        this.setActiveByUrl(this.router.url);
        this.router.events
            .pipe(takeUntil(this.destroy$))
            .subscribe(event => {
                if (event instanceof NavigationEnd) {
                    this.setActiveByUrl(event.urlAfterRedirects);
                }
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
    onItemClick(item: { label: string; icon: any; route?: string; action?: string; active?: boolean }): void {
        this.menuItems.forEach(m => m.active = false);
        item.active = true;

        if (item.action === 'logout') {
            void this.logOut();
            return;
        }

        if (item.route) {
            void this.router.navigate([item.route]);
            this.closeSidebarIfMobile();
        }
    }

    private setActiveByUrl(url: string): void {
        this.menuItems.forEach(item => {
            if (!item.route) {
                item.active = false;
                return;
            }

            // Dashboard (root) nur aktiv, wenn genau /workspace (oder mit trailing slash) besucht wird
            if (item.route === '/workspace') {
                item.active = (url === '/workspace' || url === '/workspace/');
                return;
            }

            // andere Routen bleiben per Prefix aktiv (z.B. /workspace/zplits/sub)
            item.active = url.startsWith(item.route);
        });
    }

    private closeSidebarIfMobile(): void {
        if (this.sidebarService.isMobile$.value && this.sidebarService.sidebarOpen$.value) {
            this.sidebarService.toggleSidebar();
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
