import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from './sidebar/sidebar.component';
import { TopToolbarComponent } from './top-toolbar/top-toolbar.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopToolbarComponent, BreadcrumbComponent, FooterComponent],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  @Input() sidebarCollapsed: boolean = false;
  @Input() userName: string = 'Admin User';
  @Input() userAvatar: string = '';

  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onSidebarToggle(): void {
    this.sidebarToggle.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }
}
