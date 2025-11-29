import { Component, Output, EventEmitter } from '@angular/core';
import { LucideAngularModule, Rocket } from 'lucide-angular';

@Component({
    selector: 'app-start-screen',
    imports: [LucideAngularModule],
    templateUrl: './start-screen.component.html',
    styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
    @Output() getStarted = new EventEmitter<void>();
    readonly Rocket = Rocket;
}
