import { Component, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    // Input to open/close the drawer
    @Input() open = false;

    // HostBinding applies the 'open' CSS class to the host element
    @HostBinding('class.open') get isOpen() {
        return this.open;
    }

}
