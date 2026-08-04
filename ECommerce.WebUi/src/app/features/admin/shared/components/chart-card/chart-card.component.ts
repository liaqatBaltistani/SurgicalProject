import { Component, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'admin-chart-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements AfterViewInit, OnDestroy {
  @Input() title: string = '';
  @Input() type: ChartType = 'line';
  @Input() data: ChartConfiguration['data'] = { labels: [], datasets: [] };
  @Input() options: ChartConfiguration['options'] = {};
  @Input() loading: boolean = false;
  @Input() height: number = 300;

  private chart: any = null;
  private chartCanvas: HTMLCanvasElement | null = null;

  ngAfterViewInit(): void {
    if (!this.loading && this.data && this.data.labels && this.data.labels.length > 0) {
      this.initChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  ngOnChanges(): void {
    if (!this.chart && !this.loading && this.data && this.data.labels && this.data.labels.length > 0) {
      this.initChart();
    } else if (this.chart) {
      this.updateChart();
    }
  }

  private initChart(): void {
    // Chart.js initialization will be done when the library is properly imported
    // For now, this is a placeholder for the chart implementation
    console.log('Chart initialization placeholder', { type: this.type, data: this.data });
  }

  private updateChart(): void {
    // Chart update placeholder
    console.log('Chart update placeholder');
  }
}
