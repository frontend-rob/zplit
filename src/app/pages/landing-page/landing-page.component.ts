import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StartScreenComponent } from '../../features/auth/start-screen/start-screen.component';
import { SignupComponent } from '../../features/auth/signup/signup.component';
import { LoginComponent } from '../../features/auth/login/login.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
    selector: 'app-landing-page',
    imports: [
        CommonModule,
        RouterLink,
        HeaderComponent,
        StartScreenComponent,
        SignupComponent,
        LoginComponent
    ],
    templateUrl: './landing-page.component.html',
    styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
    currentScreen: 'start' | 'signup' | 'login' = 'start';

    showSignup() {
        this.currentScreen = 'signup';
    }
    showLogin() {
        this.currentScreen = 'login';
    }
    showStart() {
        this.currentScreen = 'start';
    }
}
