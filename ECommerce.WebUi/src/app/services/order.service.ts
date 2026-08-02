import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { NotificationService } from '../core/services/notification.service';

export interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  orderId: number;
  orderNumber: string;
  userId: number;
  userName: string;
  orderStatus: string;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  discountCode: string;
  createdDate: string;
  updatedDate: string;
  orderItems: OrderItem[];
}

export interface CreateOrder {
  discountCode: string;
}

export interface UpdateOrderStatus {
  orderStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  getOrderById(id: number): Observable<any> {
    return this.apiService.get<any>(`/order/${id}`);
  }

  getMyOrders(): Observable<any> {
    return this.apiService.get<any>('/order/my-orders');
  }

  createOrder(order: CreateOrder, notify = true): Observable<any> {
    return this.apiService.post<any>('/order/checkout', order).pipe(
      tap((response) => {
        if (response.success && notify) {
          this.notificationService.showOrderPlaced();
        }
      })
    );
  }

  updateOrderStatus(id: number, status: UpdateOrderStatus, notify = true): Observable<any> {
    return this.apiService.put<any>(`/order/${id}/status`, status).pipe(
      tap(() => {
        if (notify) {
          this.notificationService.showOrderStatusUpdated();
        }
      })
    );
  }

  cancelOrder(id: number, notify = true): Observable<any> {
    return this.apiService.delete<any>(`/order/${id}`).pipe(
      tap(() => {
        if (notify) {
          this.notificationService.showOrderCancelled();
        }
      })
    );
  }

  getAllOrders(): Observable<any> {
    return this.apiService.get<any>('/order/all');
  }
}
