import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  itemsCount: number;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  createdDate: string;
}

export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderApiService extends BaseApiService {
  getOrders(page: number = 1, pageSize: number = 10, status?: string): Observable<OrderListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (status) {
      params = params.set('status', status);
    }
    
    return this.get<OrderListResponse>('Order/all', params);
  }

  getOrder(id: string): Observable<Order> {
    return this.get<Order>(`Order/${id}`);
  }

  getMyOrders(): Observable<Order[]> {
    return this.get<Order[]>('Order/my-orders');
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.put<Order>(`Order/${id}/status`, { status });
  }

  deleteOrder(id: string): Observable<void> {
    return this.delete<void>(`Order/${id}`);
  }

  generateInvoice(id: string): Observable<{ url: string }> {
    return this.post<{ url: string }>(`Order/${id}/invoice`, {});
  }
}
