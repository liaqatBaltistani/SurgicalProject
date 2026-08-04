import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProductService } from '../services/product.service';
import { Product, ProductListResponse } from '../services/product-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStore {
  private productsSignal = signal<Product[]>([]);
  private selectedProductSignal = signal<Product | null>(null);
  private loadingSignal = signal<boolean>(false);
  private savingSignal = signal<boolean>(false);
  private updatingSignal = signal<boolean>(false);
  private deletingSignal = signal<boolean>(false);
  private totalItemsSignal = signal<number>(0);
  private searchQuerySignal = signal<string>('');
  private categoryFilterSignal = signal<string>('');

  readonly products = this.productsSignal.asReadonly();
  readonly selectedProduct = this.selectedProductSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();
  readonly updating = this.updatingSignal.asReadonly();
  readonly deleting = this.deletingSignal.asReadonly();
  readonly totalItems = this.totalItemsSignal.asReadonly();
  readonly searchQuery = this.searchQuerySignal.asReadonly();
  readonly categoryFilter = this.categoryFilterSignal.asReadonly();

  readonly activeProducts = computed(() => {
    return this.productsSignal().filter(p => p.isActive === true);
  });

  readonly filteredProducts = computed(() => {
    let filtered = this.productsSignal();
    
    const category = this.categoryFilterSignal();
    if (category) {
      filtered = filtered.filter(p => p.categoryId.toString() === category);
    }
    
    const query = this.searchQuerySignal().toLowerCase();
    if (query) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  });

  constructor(private productService: ProductService) {}

  loadProducts(page: number = 1, pageSize: number = 10, search?: string): Observable<ProductListResponse> {
    this.loadingSignal.set(true);
    return this.productService.getProducts(page, pageSize, search).pipe(
      tap(response => {
        this.productsSignal.set(response.data);
        this.totalItemsSignal.set(response.total);
        this.loadingSignal.set(false);
      })
    );
  }

  loadProduct(id: string): Observable<Product> {
    this.loadingSignal.set(true);
    return this.productService.getProduct(id).pipe(
      tap(product => {
        this.selectedProductSignal.set(product);
        this.loadingSignal.set(false);
      })
    );
  }

  selectProduct(product: Product): void {
    this.selectedProductSignal.set(product);
  }

  clearSelection(): void {
    this.selectedProductSignal.set(null);
  }

  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  setCategoryFilter(category: string): void {
    this.categoryFilterSignal.set(category);
  }

  addProduct(product: Product): void {
    this.productsSignal.update(products => [...products, product]);
    this.totalItemsSignal.update(count => count + 1);
  }

  updateProduct(id: string, updates: Partial<Product>): void {
    this.productsSignal.update(products =>
      products.map(p => p.productId.toString() === id ? { ...p, ...updates } : p)
    );
  }

  deleteProduct(id: string): void {
    this.productsSignal.update(products => products.filter(p => p.productId.toString() !== id));
    this.totalItemsSignal.update(count => count - 1);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setProducts(products: Product[]): void {
    this.productsSignal.set(products);
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
