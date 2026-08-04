import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { DataTableComponent } from '../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../core/services/notification.service';
import { ProductStore } from '../stores/product.store';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, PageHeaderComponent, ToolbarComponent, DataTableComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  private productStore = inject(ProductStore);
  private productService = inject(ProductService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  columns = [
    { key: 'imageUrl', label: 'Image', type: 'image' as const, width: '80px', align: 'center' as const },
    { key: 'sku', label: 'SKU', type: 'text' as const, sortable: true },
    { key: 'name', label: 'Product Name', type: 'text' as const, sortable: true },
    { key: 'categoryId', label: 'Category', type: 'text' as const, sortable: true },
    { key: 'price', label: 'Price', type: 'text' as const, sortable: true, align: 'right' as const },
    { key: 'stockQuantity', label: 'Stock', type: 'text' as const, sortable: true, align: 'center' as const },
    { key: 'isActive', label: 'Status', type: 'badge' as const, sortable: true, align: 'center' as const }
  ];

  products = this.productStore.products;
  loading = this.productStore.loading;
  saving = this.productStore.saving;
  updating = this.productStore.updating;
  deleting = this.productStore.deleting;
  totalItems = this.productStore.totalItems;
  pageSize = 10;
  currentPage = 1;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productStore.loadProducts(this.currentPage, this.pageSize).subscribe();
  }

  onAddProduct(): void {
    this.router.navigate(['/admin/products/new']);
  }

  onAction(event: any): void {
    const { action, row } = event;
    if (action === 'view') {
      this.notificationService.info(`Viewing product: ${row.name}`);
    } else if (action === 'edit') {
      this.onEditProduct(row);
    } else if (action === 'delete') {
      this.onDeleteProduct(row);
    }
  }

  onEditProduct(product: any): void {
    this.router.navigate(['/admin/products/edit', product.productId]);
  }

  onDeleteProduct(product: any): void {
    this.productStore.setDeleting(true);
    this.productService.deleteProduct(product.productId.toString()).subscribe({
      next: () => {
        this.productStore.deleteProduct(product.productId.toString());
        this.productStore.setDeleting(false);
        this.notificationService.success('Product deleted successfully');
      },
      error: () => {
        this.productStore.setDeleting(false);
      }
    });
  }

  onExport(): void {
    this.notificationService.success('Exporting products data');
  }

  onRefresh(): void {
    this.notificationService.info('Refreshing products list');
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }
}
