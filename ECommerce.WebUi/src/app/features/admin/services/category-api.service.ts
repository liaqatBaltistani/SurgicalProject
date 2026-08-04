import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApiService } from './base-api.service';

export interface Category {
  categoryId: number;
  name: string;
  description?: string;
  isActive: boolean;
  parentCategoryId?: number;
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
export class CategoryApiService extends BaseApiService {
  getCategories(): Observable<Category[]> {
    return this.get<ApiResponse<Category[]>>('Category').pipe(
      map(response => response.data)
    );
  }

  getCategory(id: string): Observable<Category> {
    return this.get<ApiResponse<Category>>(`Category/${id}`).pipe(
      map(response => response.data)
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.post<ApiResponse<Category>>('Category', category).pipe(
      map(response => response.data)
    );
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.put<ApiResponse<Category>>(`Category/${id}`, category).pipe(
      map(response => response.data)
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.delete<ApiResponse<void>>(`Category/${id}`).pipe(
      map(response => response.data)
    );
  }
}
