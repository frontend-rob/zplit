import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ModalNewZplitComponent } from '../../components/modal-new-zplit/modal-new-zplit.component';
import { SidebarService } from '../../core/services/sidebar.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-workspace',
	imports: [
		CommonModule,
        RouterOutlet,
		ToolbarComponent,
		SidebarComponent,
        ModalNewZplitComponent
	],
	templateUrl: './workspace.component.html',
	styleUrls: ['./workspace.component.scss']
})
/**
 * WorkspaceComponent manages the main layout and responsive sidebar state.
 * It listens to viewport changes and toggles the sidebar behaviour for mobile/desktop.
 */
export class WorkspaceComponent implements OnInit, OnDestroy {
	// expose service observables to the template (declare first, assign in ctor)
	sidebarOpen$: Observable<boolean>;
	isMobile$: Observable<boolean>;

	constructor(private sidebarService: SidebarService) {
		this.sidebarOpen$ = this.sidebarService.sidebarOpen$;
		this.isMobile$ = this.sidebarService.isMobile$;
	}

	/**
	 * Initialize the component and media query listener.
	 * Sets initial isMobile state and sidebar visibility.
	 */
	ngOnInit(): void {
		this.sidebarService.init();
	}

	/**
	 * Clean up registered listeners to avoid leaks.
	 */
	ngOnDestroy(): void {
		this.sidebarService.destroy();
	}

	// delegate toggle action to the service
	toggleSidebar(): void {
		this.sidebarService.toggleSidebar();
	}
}
