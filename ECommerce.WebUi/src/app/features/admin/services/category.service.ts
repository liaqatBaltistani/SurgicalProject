import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CategoryApiService, Category } from './category-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private categoryApiService: CategoryApiService,
    private notificationService: NotificationService
  ) {}

  getCategories(): Observable<Category[]> {
    return this.categoryApiService.getCategories();
  }

  getCategory(id: string): Observable<Category> {
    return this.categoryApiService.getCategory(id);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.categoryApiService.createCategory(category).pipe(
      tap(() => this.notificationService.showCategoryCreated())
    );
  }

  updateCategory(id: string, category: Partial<Category>): Observable<Category> {
    return this.categoryApiService.updateCategory(id, category).pipe(
      tap(() => this.notificationService.showCategoryUpdated())
    );
  }

  deleteCategory(id: string): Observable<void> {
    return this.categoryApiService.deleteCategory(id).pipe(
      tap(() => this.notificationService.showCategoryDeleted())
    );
  }
}
