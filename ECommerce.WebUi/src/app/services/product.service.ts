import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  discountedPrice?: number;
  discountName?: string;
  sku?: string;
  specifications?: { label: string; value: string }[];
}

export interface ProductSearch {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface ProductSearchResult {
  products: Product[];
  totalCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private apiService: ApiService) {}

  getProductById(id: number): Observable<any> {
    return this.apiService.get<any>(`/product/${id}`);
  }

  getAllProducts(): Observable<any> {
    return this.apiService.get<any>('/product');
  }

  getProductsByCategory(categoryId: number): Observable<any> {
    return this.apiService.get<any>(`/product/category/${categoryId}`);
  }

  searchProducts(search: ProductSearch): Observable<any> {
    return this.apiService.post<any>('/product/search', search);
  }

  createProduct(product: any): Observable<any> {
    return this.apiService.post<any>('/product', product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.apiService.put<any>(`/product/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.apiService.delete<any>(`/product/${id}`);
  }
}
