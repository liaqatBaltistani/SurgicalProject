import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../services/product.service';

export interface ComparisonItem {
  product: Product;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  private readonly STORAGE_KEY = 'comparison';
  private readonly MAX_ITEMS = 4;
  private items = signal<ComparisonItem[]>([]);

  comparisonItems = computed(() => this.items());
  comparisonCount = computed(() => this.items().length);
  canAddMore = computed(() => this.items().length < this.MAX_ITEMS);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.items.set(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading comparison from storage:', e);
        this.items.set([]);
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
  }

  addToComparison(product: Product): boolean {
    if (!this.canAddMore()) {
      return false;
    }

    const exists = this.items().some(item => item.product.productId === product.productId);
    if (!exists) {
      this.items.update(items => [...items, { product, addedAt: new Date() }]);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  removeFromComparison(productId: number): void {
    this.items.update(items => items.filter(item => item.product.productId !== productId));
    this.saveToStorage();
  }

  isInComparison(productId: number): boolean {
    return this.items().some(item => item.product.productId === productId);
  }

  clearComparison(): void {
    this.items.set([]);
    this.saveToStorage();
  }

  getComparison(): ComparisonItem[] {
    return this.items();
  }
}
