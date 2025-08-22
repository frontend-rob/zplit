import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    @Output() navigateToStart = new EventEmitter<void>();
    @Output() navigateToSignup = new EventEmitter<void>();
}
