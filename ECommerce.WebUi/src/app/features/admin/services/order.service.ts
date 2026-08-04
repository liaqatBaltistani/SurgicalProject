import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { OrderApiService, Order, OrderListResponse } from './order-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private orderApiService: OrderApiService,
    private notificationService: NotificationService
  ) {}

  getOrders(page: number = 1, pageSize: number = 10, status?: string): Observable<OrderListResponse> {
    return this.orderApiService.getOrders(page, pageSize, status);
  }

  getOrder(id: string): Observable<Order> {
    return this.orderApiService.getOrder(id);
  }

  getMyOrders(): Observable<Order[]> {
    return this.orderApiService.getMyOrders();
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.orderApiService.updateOrderStatus(id, status).pipe(
      tap(() => this.notificationService.showOrderStatusUpdated())
    );
  }

  deleteOrder(id: string): Observable<void> {
    return this.orderApiService.deleteOrder(id);
  }

  generateInvoice(id: string): Observable<{ url: string }> {
    return this.orderApiService.generateInvoice(id);
  }
}
