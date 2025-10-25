import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { LucideAngularModule, ArrowUpRight } from 'lucide-angular';

@Component({
    selector: 'app-privacy-policy',
    imports: [
        RouterLink,
        HeaderComponent,
        LucideAngularModule
    ],
    templateUrl: './privacy-policy.component.html',
    styleUrls: [
        './privacy-policy.component.scss',
        '../../../styles/_article.scss'
    ]
})
export class PrivacyPolicyComponent {
    readonly ArrowUpRight = ArrowUpRight;
}
