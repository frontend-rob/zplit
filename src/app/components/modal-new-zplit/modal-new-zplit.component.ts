import { Component } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { Observable } from 'rxjs';
import { ModalService } from '../../core/services/modal.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-modal-new-zplit',
    imports: [
        CommonModule,
        LucideAngularModule],
    templateUrl: './modal-new-zplit.component.html',
    styleUrls: ['./modal-new-zplit.component.scss']
})
export class ModalNewZplitComponent {

    readonly X = X;

    isOpen$: Observable<boolean>;

    // Service public machen, damit Template direkt darauf zugreifen kann
    constructor(public modalService: ModalService) {
        this.isOpen$ = this.modalService.open$;
    }

    closeNewZplitModal(): void {
        this.modalService.close();
    }

    // closeOnBackdrop entfernt — Service übernimmt jetzt die Logik

}
