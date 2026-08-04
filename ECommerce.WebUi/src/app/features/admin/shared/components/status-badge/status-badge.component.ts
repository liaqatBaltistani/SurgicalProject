import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type BadgeStatus = 'active' | 'inactive' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'success' | 'warning' | 'danger' | 'info' | boolean;

@Component({
  selector: 'admin-status-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() status: BadgeStatus = 'active';
  @Input() text: string = '';
  @Input() icon: string = '';

  normalizedStatus = computed(() => {
    if (typeof this.status === 'boolean') {
      return this.status ? 'active' : 'inactive';
    }
    return this.status;
  });

  displayText = computed(() => {
    if (this.text) return this.text;
    if (typeof this.status === 'boolean') {
      return this.status ? 'Active' : 'Inactive';
    }
    return this.status.charAt(0).toUpperCase() + this.status.slice(1);
  });

  badgeClass = computed(() => {
    const status = this.normalizedStatus();
    return `badge-${status}`;
  });

  iconClass = computed(() => {
    const status = this.normalizedStatus();
    const icons: Record<string, string> = {
      active: 'check_circle',
      inactive: 'cancel',
      pending: 'schedule',
      processing: 'autorenew',
      shipped: 'local_shipping',
      delivered: 'done_all',
      cancelled: 'cancel',
      success: 'check_circle',
      warning: 'warning',
      danger: 'error',
      info: 'info'
    };
    return this.icon || icons[status];
  });
}
