import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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
  constructor(private apiService: ApiService) {}

  getOrderById(id: number): Observable<any> {
    return this.apiService.get<any>(`/order/${id}`);
  }

  getMyOrders(): Observable<any> {
    return this.apiService.get<any>('/order/my-orders');
  }

  createOrder(order: CreateOrder): Observable<any> {
    return this.apiService.post<any>('/order/checkout', order);
  }

  updateOrderStatus(id: number, status: UpdateOrderStatus): Observable<any> {
    return this.apiService.put<any>(`/order/${id}/status`, status);
  }

  getAllOrders(): Observable<any> {
    return this.apiService.get<any>('/order/all');
  }
}
