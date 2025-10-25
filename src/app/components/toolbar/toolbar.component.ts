import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';


@Component({
    selector: 'app-toolbar',
    imports: [CommonModule],
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
    
    @Output() toggle = new EventEmitter<void>();

    constructor() { }

    toggleSidebar() {
        this.toggle.emit();
    }

}
