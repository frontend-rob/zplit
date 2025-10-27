import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Bell, Menu } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-toolbar',
    imports: [
        CommonModule,
        LucideAngularModule
    ],
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    
    @Output() toggle = new EventEmitter<void>();

    readonly Bell = Bell;
    readonly Menu = Menu;

    constructor(private authService: AuthService, private router: Router) {}

    toggleSidebar() {
        this.toggle.emit();
    }

    async logOut(): Promise<void> {
        await this.authService.logOut();
        await this.router.navigate(['']);
    }

}
