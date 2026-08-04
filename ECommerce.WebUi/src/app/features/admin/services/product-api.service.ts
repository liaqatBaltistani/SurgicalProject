import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';

export interface Product {
  productId: number;
  categoryId: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
  isActive: boolean;
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductApiService extends BaseApiService {
  getProducts(page: number = 1, pageSize: number = 10, search?: string): Observable<ProductListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.get<ApiResponse<Product[]>>('Product', params).pipe(
      map(response => ({
        data: response.data,
        total: response.data.length,
        page: page,
        pageSize: pageSize
      }))
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.get<ApiResponse<Product>>(`Product/${id}`).pipe(
      map(response => response.data)
    );
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.post<ApiResponse<Product>>('Product', product).pipe(
      map(response => response.data)
    );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.put<ApiResponse<Product>>(`Product/${id}`, product).pipe(
      map(response => response.data)
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.delete<ApiResponse<void>>(`Product/${id}`).pipe(
      map(response => response.data)
    );
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.get<ApiResponse<Product[]>>(`Product/category/${categoryId}`).pipe(
      map(response => response.data)
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.get<ApiResponse<Product[]>>(`Product/search?query=${query}`).pipe(
      map(response => response.data)
    );
  }

  uploadProductImage(productId: number, file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/Product/${productId}/image`, formData);
  }
}
