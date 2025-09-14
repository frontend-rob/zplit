import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Service for custom form validation logic.
 * Provides static validators for name, email, and password fields.
 */
@Injectable({
    providedIn: 'root'
})
export class FormValidationService {

    constructor() { }

    /**
     * Validates that the input contains at least a first and last name, each with at least two characters.
     * Allows German umlauts and hyphens.
     * @param control The form control to validate
     * @returns ValidationErrors if invalid, otherwise null
     */
    static nameValidator(control: AbstractControl): ValidationErrors | null {
        const namePattern = /^[A-Za-z]+\s[A-Za-z]+$/;
        return namePattern.test(control.value) ? null : { invalidName: true };
    }

    /**
     * Validates that the input is a valid email address.
     * @param control The form control to validate
     * @returns ValidationErrors if invalid, otherwise null
     */
    static emailValidator(control: AbstractControl): ValidationErrors | null {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(control.value) ? null : { invalidEmail: true };
    }

    /**
     * Validates that the password has at least 8 characters.
     * @param control The form control to validate
     * @returns ValidationErrors if invalid, otherwise null
     */
    static passwordValidator(control: AbstractControl): ValidationErrors | null {
        return control.value && control.value.length >= 8 ? null : { invalidPassword: true };
    }

}
