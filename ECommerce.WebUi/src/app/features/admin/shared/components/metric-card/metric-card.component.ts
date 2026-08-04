import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'admin-metric-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss']
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() previousValue: string | number = '';
  @Input() unit: string = '';
  @Input() trend: number | null = null;
  @Input() loading: boolean = false;
  @Input() showSparkline: boolean = false;
  @Input() sparklineData: number[] = [];

  readonly Math = Math;

  trendDirection = computed(() => {
    if (this.trend === null) return null;
    return this.trend >= 0 ? 'up' : 'down';
  });

  trendColor = computed(() => {
    if (this.trend === null) return '';
    return this.trend >= 0 ? 'text-green-600' : 'text-red-600';
  });

  hasComparison(): boolean {
    return this.previousValue !== '';
  }
}
