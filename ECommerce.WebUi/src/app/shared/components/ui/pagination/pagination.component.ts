import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();
  pageSize = input(10);
  pageSizeOptions = input<number[]>([10, 25, 50, 100]);
  showPageSizeSelector = input(true);
  
  pageChanged = output<number>();
  pageSizeChanged = output<number>();

  pages = computed(() => {
    const pages: (number | string)[] = [];
    const current = this.currentPage();
    const total = this.totalPages();

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (current > 3) {
        pages.push('...');
      }

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (current < total - 2) {
        pages.push('...');
      }

      pages.push(total);
    }

    return pages;
  });

  onPageChange(page: number | string): void {
    if (typeof page === 'number') {
      if (page >= 1 && page <= this.totalPages() && page !== this.currentPage()) {
        this.pageChanged.emit(page);
      }
    }
  }

  onPrevious(): void {
    if (this.currentPage() > 1) {
      this.pageChanged.emit(this.currentPage() - 1);
    }
  }

  onNext(): void {
    if (this.currentPage() < this.totalPages()) {
      this.pageChanged.emit(this.currentPage() + 1);
    }
  }

  onPageSizeChange(event: Event): void {
    const newSize = Number((event.target as HTMLSelectElement).value);
    this.pageSizeChanged.emit(newSize);
  }
}
