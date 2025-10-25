import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-legal-notice',
    imports: [
        RouterLink,
        HeaderComponent
    ],
    templateUrl: './legal-notice.component.html',
    styleUrls: [
        './legal-notice.component.scss',
        '../../../styles/_article.scss'
    ]
})
export class LegalNoticeComponent {

}
