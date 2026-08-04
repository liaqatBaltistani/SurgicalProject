import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { Category } from '../services/category-api.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryStore {
  private categoriesSignal = signal<Category[]>([]);
  private selectedCategorySignal = signal<Category | null>(null);
  private loadingSignal = signal<boolean>(false);
  private savingSignal = signal<boolean>(false);
  private updatingSignal = signal<boolean>(false);
  private deletingSignal = signal<boolean>(false);

  readonly categories = this.categoriesSignal.asReadonly();
  readonly selectedCategory = this.selectedCategorySignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();
  readonly updating = this.updatingSignal.asReadonly();
  readonly deleting = this.deletingSignal.asReadonly();

  readonly activeCategories = computed(() => {
    return this.categoriesSignal().filter(c => c.isActive === true);
  });

  constructor(private categoryService: CategoryService) {}

  loadCategories(): Observable<Category[]> {
    this.loadingSignal.set(true);
    return this.categoryService.getCategories().pipe(
      tap(categories => {
        console.log('Categories loaded:', categories);
        this.categoriesSignal.set(categories);
        this.loadingSignal.set(false);
      }),
      tap({
        error: (error) => {
          console.error('Error loading categories in store:', error);
          this.loadingSignal.set(false);
        }
      })
    );
  }

  loadCategory(id: string): Observable<Category> {
    this.loadingSignal.set(true);
    return this.categoryService.getCategory(id).pipe(
      tap(category => {
        this.selectedCategorySignal.set(category);
        this.loadingSignal.set(false);
      })
    );
  }

  selectCategory(category: Category): void {
    this.selectedCategorySignal.set(category);
  }

  clearSelection(): void {
    this.selectedCategorySignal.set(null);
  }

  addCategory(category: Category): void {
    this.categoriesSignal.update(categories => [...categories, category]);
  }

  updateCategory(id: string, updates: Partial<Category>): void {
    this.categoriesSignal.update(categories =>
      categories.map(c => c.categoryId.toString() === id ? { ...c, ...updates } : c)
    );
  }

  deleteCategory(id: string): void {
    this.categoriesSignal.update(categories => categories.filter(c => c.categoryId.toString() !== id));
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setCategories(categories: Category[]): void {
    this.categoriesSignal.set(categories);
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
