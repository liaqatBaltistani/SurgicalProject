import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../services/product.service';

export interface RecentlyViewItem {
  product: Product;
  viewedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  private readonly STORAGE_KEY = 'recently_viewed';
  private readonly MAX_ITEMS = 10;
  private items = signal<RecentlyViewItem[]>([]);

  recentlyViewedItems = computed(() => this.items());
  recentlyViewedCount = computed(() => this.items().length);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.items.set(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading recently viewed from storage:', e);
        this.items.set([]);
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
  }

  addToRecentlyViewed(product: Product): void {
    this.items.update(items => {
      const filtered = items.filter(item => item.product.productId !== product.productId);
      const updated = [{ product, viewedAt: new Date() }, ...filtered];
      return updated.slice(0, this.MAX_ITEMS);
    });
    this.saveToStorage();
  }

  removeFromRecentlyViewed(productId: number): void {
    this.items.update(items => items.filter(item => item.product.productId !== productId));
    this.saveToStorage();
  }

  clearRecentlyViewed(): void {
    this.items.set([]);
    this.saveToStorage();
  }

  getRecentlyViewed(): RecentlyViewItem[] {
    return this.items();
  }
}
