import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FormValidationService } from '../../../core/services/form-validation.service';

/**
 * LoginComponent handles the login form, validation, and emits navigation events.
 */
@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        ReactiveFormsModule
    ],
    templateUrl: './login.component.html',
    styleUrls: [
        './login.component.scss',
        '../../../../styles/_auth.scss'
    ]
})
export class LoginComponent {

    
    @Output() navigateToStart = new EventEmitter<void>();
    @Output() navigateToSignup = new EventEmitter<void>();

    logInForm: FormGroup;

    /**
     * Creates an instance of LoginComponent.
     * @param authService The authentication service
     * @param formBuilder The form builder
     */
    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder
    ) {
        this.logInForm = this.formBuilder.group({
            email: ['', [Validators.required, FormValidationService.emailValidator]],
            password: ['', [Validators.required, FormValidationService.passwordValidator]]
        });
    }

    /**
     * Handles form submission, triggers validation and login logic.
     */
    onSubmit(): void {
        if (this.logInForm.invalid) {
            this.logInForm.markAllAsTouched();
            return;
        }
        
        // log-in logic here
    }

}
