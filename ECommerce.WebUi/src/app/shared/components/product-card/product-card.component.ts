import { Component, input, output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { Product } from '../../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { ComparisonService } from '../../services/comparison.service';
import { RecentlyViewedService } from '../../services/recently-viewed.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductCardComponent {
  private router = inject(Router);
  private wishlistService = inject(WishlistService);
  private comparisonService = inject(ComparisonService);
  private recentlyViewedService = inject(RecentlyViewedService);

  product = input.required<Product>();
  showWishlist = input(true);
  showCompare = input(true);
  showQuickView = input(true);
  
  addedToCart = output<Product>();
  quickView = output<Product>();

  isInWishlist = computed(() => this.wishlistService.isInWishlist(this.product().productId));
  isInComparison = computed(() => this.comparisonService.isInComparison(this.product().productId));

  getDiscountPercentage(): number {
    const product = this.product();
    if (!product) return 0;
    if (product.discountedPrice && product.discountedPrice < product.price) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  }

  getDisplayPrice(): number {
    return this.product().discountedPrice || this.product().price;
  }

  getOriginalPrice(): number | null {
    return this.product().discountedPrice ? this.product().price : null;
  }

  isInStock(): boolean {
    return this.product().stockQuantity > 0;
  }

  getStockStatus(): string {
    if (this.product().stockQuantity === 0) return 'Out of Stock';
    if (this.product().stockQuantity < 10) return 'Low Stock';
    return 'In Stock';
  }

  getStockStatusClass(): string {
    if (this.product().stockQuantity === 0) return 'out-of-stock';
    if (this.product().stockQuantity < 10) return 'low-stock';
    return 'in-stock';
  }

  toggleWishlist(event: Event): void {
    event.stopPropagation();
    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(this.product().productId);
    } else {
      this.wishlistService.addToWishlist(this.product());
    }
  }

  toggleComparison(event: Event): void {
    event.stopPropagation();
    if (this.isInComparison()) {
      this.comparisonService.removeFromComparison(this.product().productId);
    } else {
      const added = this.comparisonService.addToComparison(this.product());
      if (!added) {
        alert('Comparison list is full (max 4 items)');
      }
    }
  }

  onQuickView(event: Event): void {
    event.stopPropagation();
    this.quickView.emit(this.product());
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addedToCart.emit(this.product());
  }

  onViewDetails(): void {
    this.recentlyViewedService.addToRecentlyViewed(this.product());
    this.router.navigate(['/products', this.product().productId]);
  }
}
