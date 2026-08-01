import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SearchBarComponent } from '../../shared/components/ui/search-bar/search-bar.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { LoaderComponent } from '../../shared/components/ui/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, SearchBarComponent, ButtonComponent, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('staggerIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  products = signal<Product[]>([]);
  featuredProducts = signal<Product[]>([]);
  categories = signal<any[]>([]);
  searchQuery = signal('');
  loading = signal(false);
  searchResults = signal<Product[]>([]);
  isSearching = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products.set(response.data);
          this.featuredProducts.set(response.data.slice(0, 8));
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading.set(false);
      }
    });
  }

  loadCategories(): void {
    // Placeholder for categories - will be connected to API when available
    this.categories.set([
      { id: 1, name: 'Surgical Instruments', icon: 'scissors', image: '' },
      { id: 2, name: 'Diagnostic Equipment', icon: 'stethoscope', image: '' },
      { id: 3, name: 'Medical Supplies', icon: 'package', image: '' },
      { id: 4, name: 'Patient Care', icon: 'heart', image: '' },
      { id: 5, name: 'Lab Equipment', icon: 'flask', image: '' },
      { id: 6, name: 'Dental Supplies', icon: 'tooth', image: '' }
    ]);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    if (!query.trim()) {
      this.searchResults.set([]);
      this.isSearching.set(false);
      return;
    }

    this.isSearching.set(true);
    const filtered = this.products().filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    );
    this.searchResults.set(filtered);
  }

  onClearSearch(): void {
    this.searchQuery.set('');
    this.searchResults.set([]);
    this.isSearching.set(false);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({ productId: product.productId, quantity: 1 }).subscribe({
      next: (response) => {
        if (response.success) {
          // Show toast notification
        }
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
  }

  onQuickView(product: Product): void {
    // Open quick view dialog
    console.log('Quick view:', product);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }
}
