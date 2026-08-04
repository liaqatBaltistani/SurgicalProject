import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DiscountService } from '../services/discount.service';
import { Discount } from '../services/discount-api.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountStore {
  private discountsSignal = signal<Discount[]>([]);
  private selectedDiscountSignal = signal<Discount | null>(null);
  private loadingSignal = signal<boolean>(false);
  private savingSignal = signal<boolean>(false);
  private updatingSignal = signal<boolean>(false);
  private deletingSignal = signal<boolean>(false);
  private searchQuerySignal = signal<string>('');

  readonly discounts = this.discountsSignal.asReadonly();
  readonly selectedDiscount = this.selectedDiscountSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();
  readonly updating = this.updatingSignal.asReadonly();
  readonly deleting = this.deletingSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();

  readonly activeDiscounts = computed(() => {
    return this.discountsSignal().filter(d => d.status === 'active');
  });

  readonly filteredDiscounts = computed(() => {
    const query = this.searchQuerySignal().toLowerCase();
    if (!query) return this.discountsSignal();
    return this.discountsSignal().filter(d => 
      d.code.toLowerCase().includes(query) ||
      d.type.toLowerCase().includes(query)
    );
  });

  constructor(private discountService: DiscountService) {}

  loadDiscounts(): Observable<Discount[]> {
    this.loadingSignal.set(true);
    return this.discountService.getDiscounts().pipe(
      tap(discounts => {
        this.discountsSignal.set(discounts);
        this.loadingSignal.set(false);
      })
    );
  }

  loadActiveDiscounts(): Observable<Discount[]> {
    this.loadingSignal.set(true);
    return this.discountService.getActiveDiscounts().pipe(
      tap(discounts => {
        this.discountsSignal.set(discounts);
        this.loadingSignal.set(false);
      })
    );
  }

  loadDiscount(id: string): Observable<Discount> {
    this.loadingSignal.set(true);
    return this.discountService.getDiscount(id).pipe(
      tap(discount => {
        this.selectedDiscountSignal.set(discount);
        this.loadingSignal.set(false);
      })
    );
  }

  selectDiscount(discount: Discount): void {
    this.selectedDiscountSignal.set(discount);
  }

  clearSelection(): void {
    this.selectedDiscountSignal.set(null);
  }

  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  addDiscount(discount: Discount): void {
    this.discountsSignal.update(discounts => [...discounts, discount]);
  }

  updateDiscount(id: string, updates: Partial<Discount>): void {
    this.discountsSignal.update(discounts =>
      discounts.map(d => d.id === id ? { ...d, ...updates } : d)
    );
  }

  deleteDiscount(id: string): void {
    this.discountsSignal.update(discounts => discounts.filter(d => d.id !== id));
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setDiscounts(discounts: Discount[]): void {
    this.discountsSignal.set(discounts);
  }

  setSaving(saving: boolean): void {
    this.savingSignal.set(saving);
  }

  setUpdating(updating: boolean): void {
    this.updatingSignal.set(updating);
  }

  setDeleting(deleting: boolean): void {
    this.deletingSignal.set(deleting);
  }
}
