import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

@Component({
  selector: 'admin-top-toolbar',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, SearchBarComponent],
  templateUrl: './top-toolbar.component.html',
  styleUrls: ['./top-toolbar.component.scss']
})
export class TopToolbarComponent {
  @Input() sidebarCollapsed: boolean = false;
  @Input() userName: string = 'Admin User';
  @Input() userAvatar: string = '';
  @Input() notificationCount: number = 0;
  @Input() messageCount: number = 0;

  @Output() sidebarToggle = new EventEmitter<void>();
  @Output() notificationClick = new EventEmitter<void>();
  @Output() messageClick = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  profileMenuOpen = false;

  onSidebarToggle(): void {
    this.sidebarToggle.emit();
  }

  onNotificationClick(): void {
    this.notificationClick.emit();
  }

  onMessageClick(): void {
    this.messageClick.emit();
  }

  onProfileClick(): void {
    this.profileClick.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu(): void {
    this.profileMenuOpen = false;
  }
}
