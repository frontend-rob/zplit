import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ModalService implements OnDestroy {

    private _open$ = new BehaviorSubject<boolean>(false);

    readonly open$: Observable<boolean> = this._open$.asObservable();
    
    private escSub?: Subscription;

    constructor() { }

    open(): void {
        this._open$.next(true);
        this.initEscListener();
    }

    close(): void {
        this._open$.next(false);
        this.disposeEscListener();
    }

    toggle(): void {
        const next = !this._open$.value;
        this._open$.next(next);
        if (next) {
            this.initEscListener();
        } else {
            this.disposeEscListener();
        }
   }

    backdropClick(event: Event): void {
        if (event.target === event.currentTarget) {
            this.close();
        }
    }

    private initEscListener(): void {
        if (this.escSub) return;
        if (typeof window === 'undefined') return;

        this.escSub = fromEvent<KeyboardEvent>(window, 'keydown')
            .pipe(filter(event => event.key === 'Escape' || event.key === 'Esc'))
            .subscribe(() => {
                if (this._open$.value) {
                    this.close();
                }
            });
    }

    private disposeEscListener(): void {
        if (this.escSub) {
            this.escSub.unsubscribe();
            this.escSub = undefined;
        }
    }

    ngOnDestroy(): void {
        this.disposeEscListener();
    }
}
