import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowUpRight, IdCard, Tag, Building2, MapPinned, Globe, Mail } from 'lucide-angular';


@Component({
    selector: 'app-legal-notice',
    imports: [
        RouterLink,
        HeaderComponent,
        LucideAngularModule

    ],
    templateUrl: './legal-notice.component.html',
    styleUrls: [
        './legal-notice.component.scss',
        '../../../styles/_article.scss'
    ]
})
export class LegalNoticeComponent {
    readonly ArrowUpRight = ArrowUpRight;
    readonly IdCard = IdCard;
    readonly Tag = Tag;
    readonly Building2 = Building2;
    readonly MapPinned = MapPinned;
    readonly Globe = Globe;
    readonly Mail = Mail;
}
