import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-signup',
    imports: [],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    @Output() navigateToStart = new EventEmitter<void>();
    @Output() navigateToLogin = new EventEmitter<void>();
}
