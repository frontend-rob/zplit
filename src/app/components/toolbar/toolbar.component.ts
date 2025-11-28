import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Bell, Menu } from 'lucide-angular';

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

    toggleSidebar() {
        this.toggle.emit();
    }

}
