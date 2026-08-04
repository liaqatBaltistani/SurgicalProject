import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProductApiService, Product, ProductListResponse } from './product-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private productApiService: ProductApiService,
    private notificationService: NotificationService
  ) {}

  getProducts(page: number = 1, pageSize: number = 10, search?: string): Observable<ProductListResponse> {
    return this.productApiService.getProducts(page, pageSize, search);
  }

  getProduct(id: string): Observable<Product> {
    return this.productApiService.getProduct(id);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.productApiService.createProduct(product).pipe(
      tap(() => this.notificationService.showProductCreated())
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.productApiService.updateProduct(id, product).pipe(
      tap(() => this.notificationService.showProductUpdated())
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.productApiService.deleteProduct(id).pipe(
      tap(() => this.notificationService.showProductDeleted())
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.productApiService.getProductsByCategory(categoryId);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.productApiService.searchProducts(query);
  }

  uploadProductImage(productId: number, file: File): Observable<{ url: string }> {
    return this.productApiService.uploadProductImage(productId, file);
  }
}
