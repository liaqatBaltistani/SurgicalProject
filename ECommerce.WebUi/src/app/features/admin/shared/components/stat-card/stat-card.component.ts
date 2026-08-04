import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'admin-stat-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() icon: string = '';
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() trend: number | null = null;
  @Input() loading: boolean = false;
  @Input() color: 'primary' | 'success' | 'warning' | 'danger' | 'accent' = 'primary';

  readonly Math = Math;

  trendDirection = computed(() => {
    if (this.trend === null) return null;
    return this.trend >= 0 ? 'up' : 'down';
  });

  trendColor = computed(() => {
    if (this.trend === null) return '';
    return this.trend >= 0 ? 'text-green-600' : 'text-red-600';
  });

  iconColor = computed(() => {
    const colors = {
      primary: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-orange-500',
      danger: 'bg-red-500',
      accent: 'bg-teal-500'
    };
    return colors[this.color];
  });
}
