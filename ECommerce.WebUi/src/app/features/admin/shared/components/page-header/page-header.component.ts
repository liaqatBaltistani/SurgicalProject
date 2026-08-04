import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'admin-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showBackButton: boolean = false;
  @Input() actionText: string = '';
  @Input() showAction: boolean = false;
  @Input() breadcrumbs: Array<{ label: string; url?: string }> = [];

  @Output() backClick = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();

  onBackClick(): void {
    this.backClick.emit();
  }

  onActionClick(): void {
    this.actionClick.emit();
  }
}
