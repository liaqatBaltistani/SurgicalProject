import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { ProductService, Product, ProductSearch } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { SearchBarComponent } from '../../shared/components/ui/search-bar/search-bar.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { LoaderComponent } from '../../shared/components/ui/loader/loader.component';
import { PaginationComponent } from '../../shared/components/ui/pagination/pagination.component';
import { BreadcrumbComponent } from '../../shared/components/ui/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, SearchBarComponent, ButtonComponent, LoaderComponent, PaginationComponent, BreadcrumbComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  loading = signal(false);
  searchQuery = signal('');
  selectedCategory = signal(0);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  inStockOnly = signal(false);
  currentPage = signal(1);
  pageSize = signal(12);
  totalCount = signal(0);
  showFilters = signal(false);

  Math = Math;

  categories = signal<any[]>([]);

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
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
          this.filteredProducts.set(response.data);
          this.totalCount.set(response.data.length);
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
      { id: 0, name: 'All Categories' },
      { id: 1, name: 'Surgical Instruments' },
      { id: 2, name: 'Diagnostic Equipment' },
      { id: 3, name: 'Medical Supplies' },
      { id: 4, name: 'Patient Care' },
      { id: 5, name: 'Lab Equipment' }
    ]);
  }

  applyFilters(): void {
    let filtered = [...this.products()];

    // Category filter
    if (this.selectedCategory() > 0) {
      filtered = filtered.filter(p => p.categoryId === this.selectedCategory());
    }

    // Search filter
    if (this.searchQuery().trim()) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    // Price range filter
    if (this.minPrice() !== null) {
      filtered = filtered.filter(p => p.price >= this.minPrice()!);
    }
    if (this.maxPrice() !== null) {
      filtered = filtered.filter(p => p.price <= this.maxPrice()!);
    }

    // Stock filter
    if (this.inStockOnly()) {
      filtered = filtered.filter(p => p.stockQuantity > 0);
    }

    this.filteredProducts.set(filtered);
    this.totalCount.set(filtered.length);
    this.currentPage.set(1);
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);
    this.applyFilters();
  }

  onCategoryChange(categoryId: number): void {
    this.selectedCategory.set(categoryId);
    this.applyFilters();
  }

  onMinPriceChange(value: string): void {
    this.minPrice.set(value ? Number(value) : null);
  }

  onMaxPriceChange(value: string): void {
    this.maxPrice.set(value ? Number(value) : null);
  }

  onStockFilterChange(): void {
    this.inStockOnly.update(v => !v);
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set(0);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.inStockOnly.set(false);
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  getPaginatedProducts(): Product[] {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredProducts().slice(start, end);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalCount() / this.pageSize());
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

  toggleFilters(): void {
    this.showFilters.update(v => !v);
  }
}
