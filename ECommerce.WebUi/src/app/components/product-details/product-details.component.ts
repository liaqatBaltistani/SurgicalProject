import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { LoaderComponent } from '../../shared/components/ui/loader/loader.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RecentlyViewedService } from '../../shared/services/recently-viewed.service';
import { WishlistService } from '../../shared/services/wishlist.service';
import { ComparisonService } from '../../shared/services/comparison.service';
import { BreadcrumbComponent } from '../../shared/components/ui/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, LoaderComponent, ProductCardComponent, BreadcrumbComponent],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class ProductDetailsComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(false);
  error = signal('');
  quantity = signal(1);
  selectedImageIndex = signal(0);
  showZoom = signal(false);
  zoomPosition = signal({ x: 0, y: 0 });
  relatedProducts = signal<Product[]>([]);

  public route = inject(ActivatedRoute);
  public router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private recentlyViewedService = inject(RecentlyViewedService);
  private wishlistService = inject(WishlistService);
  private comparisonService = inject(ComparisonService);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(+productId);
    } else {
      this.error.set('Product ID not found');
      this.router.navigate(['/products']);
    }
  }

  loadProductDetails(productId: number): void {
    this.loading.set(true);
    this.productService.getProductById(productId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.product.set(response.data);
          this.recentlyViewedService.addToRecentlyViewed(response.data);
          this.loadRelatedProducts(response.data.categoryId);
        } else {
          this.error.set('Failed to load product details');
        }
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading product details:', error);
        this.error.set('Failed to load product details');
        this.loading.set(false);
      }
    });
  }

  loadRelatedProducts(categoryId: number): void {
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (response: any) => {
        if (response.success) {
          const related = response.data
            .filter((p: Product) => p.productId !== this.product()?.productId)
            .slice(0, 4);
          this.relatedProducts.set(related);
        }
      },
      error: (error: any) => {
        console.error('Error loading related products:', error);
      }
    });
  }

  getImages(): string[] {
    if (!this.product()) return [];
    const mainImage = this.product()!.imageUrl || '';
    return [mainImage]; // Future: expand to support multiple images
  }

  getSelectedImage(): string {
    const images = this.getImages();
    return images[this.selectedImageIndex()] || '';
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  onImageMouseMove(event: MouseEvent): void {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomPosition.set({ x, y });
  }

  toggleZoom(): void {
    this.showZoom.update(v => !v);
  }

  isInWishlist = computed(() => 
    this.product() ? this.wishlistService.isInWishlist(this.product()!.productId) : false
  );

  isInComparison = computed(() => 
    this.product() ? this.comparisonService.isInComparison(this.product()!.productId) : false
  );

  toggleWishlist(): void {
    if (!this.product()) return;
    if (this.isInWishlist()) {
      this.wishlistService.removeFromWishlist(this.product()!.productId);
    } else {
      this.wishlistService.addToWishlist(this.product()!);
    }
  }

  toggleComparison(): void {
    if (!this.product()) return;
    if (this.isInComparison()) {
      this.comparisonService.removeFromComparison(this.product()!.productId);
    } else {
      const added = this.comparisonService.addToComparison(this.product()!);
      if (!added) {
        alert('Comparison list is full (max 4 items)');
      }
    }
  }

  addToCart(): void {
    const product = this.product();
    if (product && this.quantity() > 0) {
      this.cartService.addToCart({ productId: product.productId, quantity: this.quantity() }).subscribe({
        next: (response: any) => {
          if (response.success) {
            // Show toast notification
          }
        },
        error: (error: any) => {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }

  decreaseQuantity(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  increaseQuantity(): void {
    const product = this.product();
    if (product && this.quantity() < product.stockQuantity) {
      this.quantity.update(q => q + 1);
    }
  }

  getDisplayPrice(): number {
    return this.product()?.discountedPrice || this.product()?.price || 0;
  }

  getOriginalPrice(): number | null {
    return this.product()?.discountedPrice ? this.product()?.price || null : null;
  }

  getDiscountPercentage(): number {
    if (!this.product()) return 0;
    const product = this.product()!;
    if (product.discountedPrice && product.discountedPrice < product.price) {
      return Math.round(((product.price - product.discountedPrice) / product.price) * 100);
    }
    return 0;
  }

  isInStock(): boolean {
    return this.product()?.stockQuantity ? this.product()!.stockQuantity > 0 : false;
  }

  getStockStatus(): string {
    const stock = this.product()?.stockQuantity || 0;
    if (stock === 0) return 'Out of Stock';
    if (stock < 10) return 'Low Stock';
    return 'In Stock';
  }

  parseSpecifications(specs: string): any[] {
    try {
      return JSON.parse(specs);
    } catch {
      return [];
    }
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({ productId: product.productId, quantity: 1 }).subscribe({
      next: (response: any) => {
        if (response.success) {
          // Show toast notification
        }
      },
      error: (error: any) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  onQuickView(product: Product): void {
    console.log('Quick view:', product);
  }
}
