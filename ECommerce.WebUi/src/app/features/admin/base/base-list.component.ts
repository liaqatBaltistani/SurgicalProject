import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Directive()
export abstract class BaseListComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  protected loading = false;
  protected currentPage = 1;
  protected pageSize = 10;
  protected totalItems = 0;

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected abstract loadData(): void;

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadData();
  }

  onRefresh(): void {
    this.loadData();
  }
}
