import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-signup',
    imports: [RouterLink],
    templateUrl: './signup.component.html',
    styleUrls: [
        './signup.component.scss',
        '../../../../styles/_auth.scss'
    ]
})
export class SignupComponent {
    @Output() navigateToStart = new EventEmitter<void>();
    @Output() navigateToLogin = new EventEmitter<void>();
}
