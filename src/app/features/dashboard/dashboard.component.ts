import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
    selector: 'app-dashboard',
    imports: [AsyncPipe],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

    readonly greeting$: Observable<string>;
    readonly username$: Observable<string>;

    /**
     * Creates an instance of DashboardComponent.
     * @param dashboardService - service that provides greeting and username observables
     */
    constructor(private dashboardService: DashboardService) {
        this.greeting$ = this.dashboardService.greeting$;
        this.username$ = this.dashboardService.username$;
    }

}