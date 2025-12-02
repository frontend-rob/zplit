import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Menu, Plus } from 'lucide-angular';
import { ModalService } from '../../core/services/modal.service';

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

    readonly Menu = Menu;
    readonly Plus = Plus;

    constructor(private modalService: ModalService) {}

    toggleSidebar() {
        this.toggle.emit();
    }

    openNewZplitModal(): void {
        this.modalService.open();
    }

}
