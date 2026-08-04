import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PageHeaderComponent } from '../shared/components/page-header/page-header.component';
import { ToolbarComponent } from '../shared/components/toolbar/toolbar.component';
import { DataTableComponent } from '../shared/components/data-table/data-table.component';
import { NotificationService } from '../../../core/services/notification.service';
import { DiscountStore } from '../stores/discount.store';
import { DiscountService } from '../services/discount.service';

@Component({
  selector: 'admin-discounts',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, PageHeaderComponent, ToolbarComponent, DataTableComponent],
  templateUrl: './discounts.component.html',
  styleUrls: []
})
export class DiscountsComponent implements OnInit {
  private discountStore = inject(DiscountStore);
  private discountService = inject(DiscountService);
  private notificationService = inject(NotificationService);

  columns = [
    { key: 'code', label: 'Code', type: 'text' as const, sortable: true },
    { key: 'type', label: 'Type', type: 'badge' as const, sortable: true, align: 'center' as const },
    { key: 'value', label: 'Value', type: 'text' as const, sortable: true, align: 'right' as const },
    { key: 'minPurchase', label: 'Min Purchase', type: 'text' as const, sortable: true, align: 'right' as const },
    { key: 'startDate', label: 'Start Date', type: 'text' as const, sortable: true },
    { key: 'endDate', label: 'End Date', type: 'text' as const, sortable: true },
    { key: 'usedCount', label: 'Used', type: 'text' as const, sortable: true, align: 'center' as const },
    { key: 'status', label: 'Status', type: 'badge' as const, sortable: true, align: 'center' as const }
  ];

  discounts = this.discountStore.discounts;
  loading = this.discountStore.loading;
  saving = this.discountStore.saving;
  updating = this.discountStore.updating;
  deleting = this.discountStore.deleting;

  ngOnInit(): void {
    this.loadDiscounts();
  }

  loadDiscounts(): void {
    this.discountStore.loadDiscounts().subscribe();
  }

  onAddDiscount(): void {
    this.notificationService.info('Navigating to add discount form');
  }

  onAction(event: any): void {
    const { action, row } = event;
    if (action === 'view') {
      this.notificationService.info(`Viewing discount: ${row.code}`);
    } else if (action === 'edit') {
      this.onEditDiscount(row);
    } else if (action === 'delete') {
      this.onDeleteDiscount(row);
    }
  }

  onEditDiscount(discount: any): void {
    this.notificationService.info(`Editing discount: ${discount.code}`);
  }

  onDeleteDiscount(discount: any): void {
    this.discountStore.setDeleting(true);
    this.discountService.deleteDiscount(discount.id).subscribe({
      next: () => {
        this.discountStore.deleteDiscount(discount.id);
        this.discountStore.setDeleting(false);
        this.notificationService.success('Discount deleted successfully');
      },
      error: () => {
        this.discountStore.setDeleting(false);
      }
    });
  }

  onExport(): void {
    this.notificationService.success('Exporting discounts data');
  }

  onRefresh(): void {
    this.notificationService.info('Refreshing discounts list');
    this.loadDiscounts();
  }
}
