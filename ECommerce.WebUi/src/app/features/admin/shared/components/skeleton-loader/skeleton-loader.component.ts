import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'card' | 'table-row' | 'text' | 'avatar' | 'circle' | 'rect';

@Component({
  selector: 'admin-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {
  @Input() type: SkeletonType = 'rect';
  @Input() width: string = '100%';
  @Input() height: string = '1rem';
  @Input() count: number = 1;
  @Input() rows: number = 3;

  getArray(count: number): number[] {
    return Array(count).fill(0);
  }
}
