import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-start-screen',
    imports: [],
    templateUrl: './start-screen.component.html',
    styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
    @Output() getStarted = new EventEmitter<void>();
}
