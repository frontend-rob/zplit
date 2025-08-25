import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-privacy-policy',
    imports: [
        RouterLink,
        HeaderComponent
    ],
    templateUrl: './privacy-policy.component.html',
    styleUrls: [
        './privacy-policy.component.scss',
        '../../../styles/_article.scss'
    ]
})
export class PrivacyPolicyComponent {

}
