import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FormValidationService } from '../../../core/services/form-validation.service';

/**
 * SignupComponent handles the signup form, validation, and emits navigation events.
 */
@Component({
    selector: 'app-signup',
    imports: [
        CommonModule,
        RouterLink,
        ReactiveFormsModule,
    ],
    templateUrl: './signup.component.html',
    styleUrls: [
        './signup.component.scss',
        '../../../../styles/_auth.scss'
    ]
})
export class SignupComponent {
    
    @Output() navigateToStart = new EventEmitter<void>();
    @Output() navigateToLogin = new EventEmitter<void>();

    signUpForm: FormGroup;

    /**
     * Creates an instance of SignupComponent.
     * @param authService The authentication service
     * @param formBuilder The form builder
     */
    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
    ) {
        this.signUpForm = this.formBuilder.group({
            username: ['', [Validators.required, FormValidationService.nameValidator]],
            email: ['', [Validators.required, FormValidationService.emailValidator]],
            password: ['', [Validators.required, FormValidationService.passwordValidator]],
            policy: [false, [Validators.requiredTrue]]
        });
    }

    /**
     * Handles form submission, triggers validation and signup logic.
     */
    onSubmit(): void {
        if (this.signUpForm.invalid) {
            this.signUpForm.markAllAsTouched();
            return;
        }
        
        // sign-up logic here

    }
}
