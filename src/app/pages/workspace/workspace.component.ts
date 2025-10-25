import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
	selector: 'app-workspace',
	imports: [
		CommonModule,
		ToolbarComponent,
		SidebarComponent
	],
	templateUrl: './workspace.component.html',
	styleUrls: ['./workspace.component.scss']
})
/**
 * WorkspaceComponent manages the main layout and responsive sidebar state.
 * It listens to viewport changes and toggles the sidebar behaviour for mobile/desktop.
 */
export class WorkspaceComponent implements OnInit, OnDestroy {
	sidebarOpen = false;
	isMobile = true;

	private readonly breakpoint = '(max-width: 1023px)';
	private mql?: MediaQueryList;
	private mqlListener?: (e: MediaQueryListEvent) => void;

	/**
	 * Initialize the component and media query listener.
	 * Sets initial isMobile state and sidebar visibility.
	 */
	ngOnInit(): void {
		if (typeof window === 'undefined' || !('matchMedia' in window)) {
			this.isMobile = false;
			this.setSidebarForScreen();
			return;
		}

		this.mql = window.matchMedia(this.breakpoint);
		this.isMobile = this.mql.matches;
		this.setSidebarForScreen();
		this.registerMediaQueryListener();
	}

	/**
	 * Clean up registered listeners to avoid leaks.
	 */
	ngOnDestroy(): void {
		this.unregisterMediaQueryListener();
	}

	/**
	 * Register media query listener using modern and legacy APIs.
	 */
	private registerMediaQueryListener(): void {
		if (!this.mql) return;

		this.mqlListener = (e: MediaQueryListEvent) => {
			this.isMobile = e.matches;
			this.setSidebarForScreen();
		};

		if ('addEventListener' in this.mql) {
			this.mql.addEventListener('change', this.mqlListener);
		} else if ((this.mql as any).addListener) {
			// legacy Safari/older browsers
			(this.mql as any).addListener(this.mqlListener);
		}
	}

	/**
	 * Unregister the media query listener using modern and legacy APIs.
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
	 * Update sidebar state based on current isMobile flag.
	 */
	private setSidebarForScreen(): void {
		this.sidebarOpen = this.isMobile ? false : true;
	}

	/**
	 * Toggle the sidebar only on mobile devices.
	 */
	toggleSidebar(): void {
		if (this.isMobile) {
			this.sidebarOpen = !this.sidebarOpen;
		}
	}
}
