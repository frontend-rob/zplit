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
     * @param sidebarService - service controlling sidebar open/close state (mobile)
     */
    constructor(private authService: AuthService, private router: Router, private sidebarService: SidebarService) { }

    /**
     * Menu items displayed in the sidebar.
     * Each item may have a label, icon, route or special action.
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
     * Angular lifecycle hook: initialize component, subscribe to user and router events.
     */
    ngOnInit(): void {
        this.authService.user$
            .pipe(takeUntil(this.destroy$))
            .subscribe(fbUser => {
                void this.handleUserChange(fbUser);
            });

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
     * Angular lifecycle hook: clean up subscriptions.
     */
    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Handles updates when the Firebase Auth user changes.
     * Tries to load Firestore profile data and falls back to auth user fields.
     *
     * @param fbUser - Firebase Auth user or null when logged out
     * @returns Promise<void> resolves when local username/email are updated
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
     * Clears the displayed username and email (used on logout).
     */
    private clearUser(): void {
        this.username = '';
        this.email = '';
    }

    /**
     * Click handler for sidebar items: navigates or performs actions like logout.
     *
     * @param item - the clicked menu item
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

    /**
     * Sets the active menu item based on the current router URL.
     *
     * @param url - current router URL
     */
    private setActiveByUrl(url: string): void {
        this.menuItems.forEach(item => {
            if (!item.route) {
                item.active = false;
                return;
            }

            if (item.route === '/workspace') {
                item.active = (url === '/workspace' || url === '/workspace/');
                return;
            }

            item.active = url.startsWith(item.route);
        });
    }

    /**
     * Closes the sidebar on mobile when a navigation has occurred.
     */
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
     * Logs the current user out and navigates to the root route.
     *
     * @returns Promise<void>
     */
    async logOut(): Promise<void> {
        await this.authService.logOut();
        await this.router.navigate(['']);
    }

}
