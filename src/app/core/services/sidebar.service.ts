import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
/**
 * Service that manages the application sidebar state and adapts it to the current screen size.
 * It exposes observables that components can subscribe to in order to react to sidebar open/close
 * state and whether the app is running on a mobile-sized viewport.
 */
export class SidebarService {
    
    // CSS media query breakpoint used to determine "mobile" screens.
    private readonly breakpoint = '(max-width: 1023px)';
    
    // MediaQueryList returned by window.matchMedia for the configured breakpoint.
    private mql?: MediaQueryList;

    // Listener function attached to the MediaQueryList change events.
    private mqlListener?: (e: MediaQueryListEvent) => void;

     // Observable that emits whether the sidebar is currently open. 
    sidebarOpen$ = new BehaviorSubject<boolean>(true);
    
    // Observable that emits whether the current viewport matches the configured mobile breakpoint.
    isMobile$ = new BehaviorSubject<boolean>(false);

    /**
     * Initialize the service: determine initial mobile state, set the sidebar accordingly,
     * and register a listener for viewport changes when running in a browser.
     *
     * Call this (for example) during application startup.
     *
     * @returns void
     */
    init(): void {
        if (typeof window === 'undefined' || !('matchMedia' in window)) {
            this.isMobile$.next(false);
            this.setSidebarForScreen();
            return;
        }

        this.mql = window.matchMedia(this.breakpoint);
        this.isMobile$.next(this.mql.matches);
        this.setSidebarForScreen();
        this.registerMediaQueryListener();
    }

    /**
     * Clean up any registered listeners. Call when the service is no longer needed (e.g. app destroy).
     *
     * @returns void
     */
    destroy(): void {
        this.unregisterMediaQueryListener();
    }

    /**
     * Toggle the sidebar open state. Only toggles when running in "mobile" mode to avoid
     * changing layout unexpectedly on larger screens.
     *
     * @returns void
     */
    toggleSidebar(): void {
        if (this.isMobile$.value) {
            this.sidebarOpen$.next(!this.sidebarOpen$.value);
        }
    }

    /**
     * Register a cross-browser media query change listener on the stored MediaQueryList.
     * Uses addEventListener('change') when available and falls back to addListener for older browsers.
     * @private
     */
    private registerMediaQueryListener(): void {
        if (!this.mql) return;

        this.mqlListener = (e: MediaQueryListEvent) => {
            this.isMobile$.next(e.matches);
            this.setSidebarForScreen();
        };

        if ('addEventListener' in this.mql) {
            this.mql.addEventListener('change', this.mqlListener);
        } else if ((this.mql as any).addListener) {
            (this.mql as any).addListener(this.mqlListener);
        }
    }

    /**
     * Unregister the previously attached media query listener, using the appropriate
     * removeEventListener/removeListener API depending on browser support.
     * @private
     */
    private unregisterMediaQueryListener(): void {
        if (!this.mql || !this.mqlListener) return;

        if ('removeEventListener' in this.mql) {
            this.mql.removeEventListener('change', this.mqlListener);
        } else if ((this.mql as any).removeListener) {
            (this.mql as any).removeListener(this.mqlListener);
        }

        this.mqlListener = undefined;
    }

    /**
     * Set the sidebar open state based on the current isMobile$ value.
     * On mobile the sidebar is closed by default; on larger screens it is open.
     * @private
     */
    private setSidebarForScreen(): void {
        this.sidebarOpen$.next(this.isMobile$.value ? false : true);
    }
}
