import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FormValidationService } from '../../../core/services/form-validation.service';
import { Router } from '@angular/router';
import { LucideAngularModule, X, Mail, Lock } from 'lucide-angular';

/**
 * LoginComponent handles the login form, validation, and emits navigation events.
 * It also manages error messages for both client-side validation and server-side authentication errors.
 */
@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        LucideAngularModule
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

    readonly X = X;
    readonly Mail = Mail;
    readonly Lock = Lock;

    /**
     * Reactive login form group.
     */
    logInForm: FormGroup;

    /**
     * Holds error messages for validation or authentication errors.
     */
    errorMessage: string | null = null;

    /**
     * Creates an instance of LoginComponent.
     * @param authService The authentication service.
     * @param formBuilder The form builder.
     * @param router The Angular router.
     */
    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
        this.logInForm = this.formBuilder.group({
            email: ['', [Validators.required, FormValidationService.emailValidator]],
            password: ['', [Validators.required, FormValidationService.passwordValidator]]
        });
    }

    /**
     * Handles form submission, triggers validation and login logic.
     * Sets error messages for both client-side and server-side errors.
     */
    async logIn(): Promise<void> {
        if (this.logInForm.invalid) {
            this.logInForm.markAllAsTouched();
            return;
        }
        this.errorMessage = null;
        try {
            await this.authService.logIn(
                this.logInForm.value.email,
                this.logInForm.value.password
            );
            this.router.navigate(['/workspace/dashboard']);
        } catch (error: any) {
            this.handleLoginError(error);
        }
    }

    /**
     * Handles server-side authentication errors and sets appropriate error messages.
     * @param error The error object returned from Firebase authentication.
     */
    private handleLoginError(error: any): void {
        if (error?.code === 'auth/invalid-credential') {
            this.errorMessage = '*Invalid email or password. Please try again.';
        } else {
            this.errorMessage = '*Unexpected error occurred. Please try again.';
        }
    }

    /**
     * Signs in the user with Google account using the AuthService.
     * Navigates to the workspace on successful login, handles errors otherwise.
     */
    async signInWithGoogle(): Promise<void> {
        this.errorMessage = null;
        try {
            await this.authService.signInWithGoogle();
            this.router.navigate(['/workspace']);
        } catch (error: any) {
            this.handleLoginError(error);
        }
    }

}
