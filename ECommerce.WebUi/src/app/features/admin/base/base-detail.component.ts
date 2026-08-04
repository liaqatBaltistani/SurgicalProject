import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Directive()
export abstract class BaseDetailComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  protected loading = false;
  protected id!: string;

  constructor(protected route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected abstract loadData(): void;

  protected abstract deleteItem(): void;

  onDelete(): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.deleteItem();
    }
  }
}
