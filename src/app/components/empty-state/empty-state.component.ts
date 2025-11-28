import { Component } from '@angular/core';
import { LucideAngularModule, Inbox, Sparkles } from 'lucide-angular';

@Component({
    selector: 'app-empty-state',
    imports: [
        LucideAngularModule
    ],
    templateUrl: './empty-state.component.html',
    styleUrl: './empty-state.component.scss'
})
export class EmptyStateComponent {

    readonly Inbox = Inbox;
    readonly Sparkles = Sparkles;

    createNewZplit() {
        console.log('Create New Zplit button clicked');
    }
}
