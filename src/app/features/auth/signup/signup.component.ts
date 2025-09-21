import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { FormValidationService } from '../../../core/services/form-validation.service';

/**
 * Interface for signup form data.
 */
interface SignupFormData {
    userName: string;
    email: string;
    password: string;
}

/**
 * SignupComponent manages the signup form, validation, and emits navigation events.
 * It also handles user registration and saving user data to Firestore.
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
    @Output() registrationSuccess = new EventEmitter<void>();

    /**
     * Reactive signup form group.
     */
    signUpForm: FormGroup;

    /**
     * Holds error messages for validation or registration errors.
     */
    errorMessage: string | null = null;

    /**
     * Initializes the SignupComponent and sets up the signup form.
     * @param authService Service for authentication and user management.
     * @param formBuilder Service for building reactive forms.
     */
    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
    ) {
        this.signUpForm = this.formBuilder.group({
            userName: ['', [Validators.required, FormValidationService.nameValidator]],
            email: ['', [Validators.required, FormValidationService.emailValidator]],
            password: ['', [Validators.required, FormValidationService.passwordValidator]],
            policy: [false, [Validators.requiredTrue]]
        });
    }

    /**
     * Extracts user data from the signup form.
     * @returns An object containing userName, email, and password.
     */
    private getFormData(): SignupFormData {
        const { userName, email, password } = this.signUpForm.value;
        return { userName: userName as string, email: email as string, password: password as string };
    }

    /**
     * Registers the user with Firebase Authentication and saves user data to Firestore.
     * @param userName The user's full name.
     * @param email The user's email address.
     * @param password The user's password.
     * @returns A promise that resolves when registration and saving are complete.
     */
    private async registerAndSaveUser(userName: string, email: string, password: string): Promise<void> {
        const userCredential = await this.authService.registerUser(email, password);
        await this.authService.saveUserToFirestore(userCredential.user.uid, {
            uid: userCredential.user.uid,
            userName,
            email
        });
    }

    /**
     * Handles form submission, triggers validation, registration, and emits success event.
     * Sets error messages for registration failures.
     * @returns A promise that resolves when the process is complete.
     */
    async signUp(): Promise<void> {
        if (this.signUpForm.invalid) {
            this.signUpForm.markAllAsTouched();
            return;
        }
        this.errorMessage = null;
        const { userName, email, password } = this.getFormData();
        try {
            await this.registerAndSaveUser(userName, email, password);
            this.signUpForm.reset();
            this.registrationSuccess.emit();
        } catch (error: any) {
            this.handleSignupError(error);
        }
    }

    /**
     * Handles error messages for registration failures.
     * @param error The error object returned from Firebase authentication.
     */
    private handleSignupError(error: unknown): void {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            const code = (error as { code?: string }).code;
            if (code === 'auth/email-already-in-use') {
                this.errorMessage = '*E-mail already registered - please use another.';
                return;
            }
        }
        this.errorMessage = '*Registration failed. Please try again.';
    }
}
