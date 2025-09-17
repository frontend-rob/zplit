import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { LoginComponent } from '../../features/auth/login/login.component';
import { SignupComponent } from '../../features/auth/signup/signup.component';
import { StartScreenComponent } from '../../features/auth/start-screen/start-screen.component';

@Component({
    selector: 'app-landing-page',
    imports: [
        CommonModule,
        RouterLink,
        HeaderComponent,
        StartScreenComponent,
        LoginComponent,
        SignupComponent
    ],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss',
})
/**
 * Landing page component that displays start, signup, and login screens.
 */
export class LandingPageComponent {
    /**
     * Current active screen ('start', 'signup', or 'login').
     */
    currentScreen: 'start' | 'signup' | 'login' = 'start';

    /**
     * Shows the start screen and redraws the canvas.
     */
    showStart() {
        this.currentScreen = 'start';
    }

    /**
     * Shows the login screen and redraws the canvas.
     */
    showLogin() {
        this.currentScreen = 'login';
    }

    /**
     * Shows the signup screen and redraws the canvas.
     */
    showSignup() {
        this.currentScreen = 'signup';
    }

    /**
     * Switches to the login screen after successful registration.
     */
    onRegistrationSuccess() {
        this.currentScreen = 'login';
    }

}
