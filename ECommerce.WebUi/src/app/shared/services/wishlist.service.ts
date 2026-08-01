import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../../services/product.service';

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'wishlist';
  private items = signal<WishlistItem[]>([]);

  wishlistItems = computed(() => this.items());
  wishlistCount = computed(() => this.items().length);
  wishlistProductIds = computed(() => this.items().map(item => item.product.productId));

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.items.set(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading wishlist from storage:', e);
        this.items.set([]);
      }
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items()));
  }

  addToWishlist(product: Product): void {
    const exists = this.items().some(item => item.product.productId === product.productId);
    if (!exists) {
      this.items.update(items => [...items, { product, addedAt: new Date() }]);
      this.saveToStorage();
    }
  }

  removeFromWishlist(productId: number): void {
    this.items.update(items => items.filter(item => item.product.productId !== productId));
    this.saveToStorage();
  }

  isInWishlist(productId: number): boolean {
    return this.items().some(item => item.product.productId === productId);
  }

  clearWishlist(): void {
    this.items.set([]);
    this.saveToStorage();
  }

  getWishlist(): WishlistItem[] {
    return this.items();
  }
}
