import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { StartScreenComponent } from '../../features/auth/start-screen/start-screen.component';
import { LoginComponent } from '../../features/auth/login/login.component';
import { SignupComponent } from '../../features/auth/signup/signup.component';

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
 * Handles background canvas drawing and resizing.
 */
export class LandingPageComponent implements AfterViewInit, OnDestroy {
    /**
     * Current active screen ('start', 'signup', or 'login').
     */
    currentScreen: 'start' | 'signup' | 'login' = 'start';

    /**
     * Reference to the background canvas element.
     */
    @ViewChild('dotCanvas', { static: true })
    canvasRef!: ElementRef<HTMLCanvasElement>;

    /**
     * Observer for resizing the canvas host element.
     */
    private resizeObserver!: ResizeObserver;

    /**
     * Lifecycle hook called after the view is initialized.
     * Redraws the canvas and starts observing for resize events.
     */
    ngAfterViewInit() {
        this.drawCanvas();
        this.observeResizing();
    }

    /**
     * Lifecycle hook called when the component is destroyed.
     * Disconnects the resize observer.
     */
    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }

    /**
     * Shows the start screen and redraws the canvas.
     */
    showStart() {
        this.currentScreen = 'start';
        this.drawCanvas();
    }

    /**
     * Shows the login screen and redraws the canvas.
     */
    showLogin() {
        this.currentScreen = 'login';
        this.drawCanvas();
    }

    /**
     * Shows the signup screen and redraws the canvas.
     */
    showSignup() {
        this.currentScreen = 'signup';
        this.drawCanvas();
    }

    /**
     * Initializes the canvas size and scaling for device pixel ratio.
     * @param canvas The canvas element
     * @param ctx The 2D rendering context
     */
    private initCanvas(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) {
        const host = canvas.parentElement!;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = host.offsetWidth * dpr;
        canvas.height = host.offsetHeight * dpr;
        ctx.resetTransform?.();
        ctx.scale(dpr, dpr);
    }

    /**
     * Draws randomly colored dots on the canvas.
     * @param canvas The canvas element
     * @param ctx The 2D rendering context
     */
    private drawDots(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) {
        const spacing = 32;
        const colors = ['#f4f4f5', '#e4e4e7', '#d4d4d8', '#a1a1aa', '#fde047'];
        const baseRadius = 1.5;
        const dpr = window.devicePixelRatio || 1;
        const rows = Math.ceil(canvas.height / dpr / spacing);
        const cols = Math.ceil(canvas.width / dpr / spacing);
        for (let row = 0; row <= rows; row++) {
            for (let col = 0; col <= cols; col++) {
                const x = col * spacing + spacing / 2;
                const y = row * spacing + spacing / 2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const radius = baseRadius * (Math.random() * 0.75 + 0.75);
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    /**
     * Clears the entire canvas.
     * @param canvas The canvas element
     * @param ctx The 2D rendering context
     */
    private clearCanvas(
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Redraws the background canvas with randomly colored dots.
     * Adjusts for device pixel ratio and host size.
     */
    private drawCanvas() {
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        this.initCanvas(canvas, ctx);
        this.clearCanvas(canvas, ctx);
        this.drawDots(canvas, ctx);
    }

    /**
     * Observes resizing of the canvas host element and redraws the canvas on resize.
     */
    private observeResizing() {
        const host = this.canvasRef.nativeElement.parentElement!;
        this.resizeObserver = new ResizeObserver(() => this.drawCanvas());
        this.resizeObserver.observe(host);
    }
}
