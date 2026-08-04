import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface ActionMenuItem {
  label: string;
  icon: string;
  action: string;
  disabled?: boolean;
  divider?: boolean;
}

@Component({
  selector: 'admin-action-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent {
  @Input() items: ActionMenuItem[] = [];
  @Input() label: string = 'Actions';
  @Input() icon: string = 'more_vert';

  @Output() actionClick = new EventEmitter<string>();

  isOpen = false;

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  onActionClick(item: ActionMenuItem): void {
    if (item.disabled) return;
    this.actionClick.emit(item.action);
    this.closeMenu();
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-menu')) {
      this.closeMenu();
    }
  }
}
