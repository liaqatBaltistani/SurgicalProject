import { Component, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { DataTableComponent } from '../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoryStore } from '../stores/category.store';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'admin-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, PageHeaderComponent, ToolbarComponent, DataTableComponent],
  templateUrl: './categories.component.html',
  styleUrls: []
})
export class CategoriesComponent implements OnInit {
  private categoryStore = inject(CategoryStore);
  private categoryService = inject(CategoryService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  columns = [
    { key: 'name', label: 'Category Name', type: 'text' as const, sortable: true },
    { key: 'description', label: 'Description', type: 'text' as const },
    { key: 'parentCategoryId', label: 'Parent Category', type: 'text' as const, sortable: true },
    { key: 'isActive', label: 'Status', type: 'badge' as const, sortable: true, align: 'center' as const }
  ];

  categories = this.categoryStore.categories;
  loading = this.categoryStore.loading;
  saving = this.categoryStore.saving;
  updating = this.categoryStore.updating;
  deleting = this.categoryStore.deleting;

  ngOnInit(): void {
    this.loadCategories();
    // Debug: Log the categories signal value using effect
    effect(() => {
      console.log('Categories signal value:', this.categories());
    });
  }

  loadCategories(): void {
    this.categoryStore.loadCategories().subscribe({
      error: (error) => {
        console.error('Error loading categories:', error);
        this.notificationService.error('Failed to load categories');
      }
    });
  }

  onAddCategory(): void {
    this.router.navigate(['/admin/categories/new']);
  }

  onAction(event: any): void {
    const { action, row } = event;
    if (action === 'view') {
      this.notificationService.info(`Viewing category: ${row.name}`);
    } else if (action === 'edit') {
      this.onEditCategory(row);
    } else if (action === 'delete') {
      this.onDeleteCategory(row);
    }
  }

  onEditCategory(category: any): void {
    this.router.navigate(['/admin/categories/edit', category.categoryId]);
  }

  onDeleteCategory(category: any): void {
    this.categoryStore.setDeleting(true);
    this.categoryService.deleteCategory(category.categoryId.toString()).subscribe({
      next: () => {
        this.categoryStore.deleteCategory(category.categoryId.toString());
        this.categoryStore.setDeleting(false);
        this.notificationService.success('Category deleted successfully');
      },
      error: () => {
        this.categoryStore.setDeleting(false);
      }
    });
  }

  onExport(): void {
    this.notificationService.success('Exporting categories data');
  }

  onRefresh(): void {
    this.notificationService.info('Refreshing categories list');
    this.loadCategories();
  }
}
