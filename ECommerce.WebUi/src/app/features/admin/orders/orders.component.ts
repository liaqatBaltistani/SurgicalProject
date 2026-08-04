import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { DataTableComponent } from '../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../core/services/notification.service';
import { OrderStore } from '../stores/order.store';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, PageHeaderComponent, ToolbarComponent, DataTableComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  private orderStore = inject(OrderStore);
  private orderService = inject(OrderService);
  private notificationService = inject(NotificationService);

  columns = [
    { key: 'orderNumber', label: 'Order Number', type: 'text' as const, sortable: true },
    { key: 'customerName', label: 'Customer Name', type: 'text' as const, sortable: true },
    { key: 'itemsCount', label: 'Items', type: 'text' as const, sortable: true, align: 'center' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, sortable: true, align: 'center' as const },
    { key: 'paymentMethod', label: 'Payment Method', type: 'text' as const, sortable: true },
    { key: 'totalAmount', label: 'Total Amount', type: 'text' as const, sortable: true, align: 'right' as const },
    { key: 'createdDate', label: 'Created Date', type: 'text' as const, sortable: true }
  ];

  orders = this.orderStore.orders;
  loading = this.orderStore.loading;
  saving = this.orderStore.saving;
  updating = this.orderStore.updating;
  deleting = this.orderStore.deleting;
  totalItems = this.orderStore.totalItems;
  pageSize = 10;
  currentPage = 1;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderStore.loadOrders(this.currentPage, this.pageSize).subscribe();
  }

  onAction(event: any): void {
    const { action, row } = event;
    if (action === 'view') {
      this.notificationService.info(`Viewing order: ${row.orderNumber}`);
    } else if (action === 'invoice') {
      this.notificationService.info(`Generating invoice for order: ${row.orderNumber}`);
    } else if (action === 'update') {
      this.notificationService.info(`Updating status for order: ${row.orderNumber}`);
    }
  }

  onExport(): void {
    this.notificationService.success('Exporting orders data');
  }

  onRefresh(): void {
    this.notificationService.info('Refreshing orders list');
    this.loadOrders();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadOrders();
  }
}
