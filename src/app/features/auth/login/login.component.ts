import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.scss',
        '../../../../styles/_auth.scss'
    ]
})
export class LoginComponent {
    @Output() navigateToStart = new EventEmitter<void>();
    @Output() navigateToSignup = new EventEmitter<void>();
}
