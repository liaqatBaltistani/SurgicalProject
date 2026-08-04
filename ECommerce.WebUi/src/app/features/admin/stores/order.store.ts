import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { OrderService } from '../services/order.service';
import { Order, OrderListResponse } from '../services/order-api.service';

@Injectable({
  providedIn: 'root'
})
export class OrderStore {
  private ordersSignal = signal<Order[]>([]);
  private selectedOrderSignal = signal<Order | null>(null);
  private loadingSignal = signal<boolean>(false);
  private savingSignal = signal<boolean>(false);
  private updatingSignal = signal<boolean>(false);
  private deletingSignal = signal<boolean>(false);
  private totalItemsSignal = signal<number>(0);
  private statusFilterSignal = signal<string>('');

  readonly orders = this.ordersSignal.asReadonly();
  readonly selectedOrder = this.selectedOrderSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();
  readonly updating = this.updatingSignal.asReadonly();
  readonly deleting = this.deletingSignal.asReadonly();
  readonly totalItems = this.totalItemsSignal.asReadonly();
  readonly statusFilter = this.statusFilterSignal.asReadonly();

  readonly pendingOrders = computed(() => {
    return this.ordersSignal().filter(o => o.status === 'pending');
  });

  readonly processingOrders = computed(() => {
    return this.ordersSignal().filter(o => o.status === 'processing');
  });

  readonly filteredOrders = computed(() => {
    const status = this.statusFilterSignal();
    if (!status) return this.ordersSignal();
    return this.ordersSignal().filter(o => o.status === status);
  });

  constructor(private orderService: OrderService) {}

  loadOrders(page: number = 1, pageSize: number = 10, status?: string): Observable<OrderListResponse> {
    this.loadingSignal.set(true);
    return this.orderService.getOrders(page, pageSize, status).pipe(
      tap(response => {
        this.ordersSignal.set(response.data);
        this.totalItemsSignal.set(response.total);
        this.loadingSignal.set(false);
      })
    );
  }

  loadOrder(id: string): Observable<Order> {
    this.loadingSignal.set(true);
    return this.orderService.getOrder(id).pipe(
      tap(order => {
        this.selectedOrderSignal.set(order);
        this.loadingSignal.set(false);
      })
    );
  }

  loadMyOrders(): Observable<Order[]> {
    this.loadingSignal.set(true);
    return this.orderService.getMyOrders().pipe(
      tap(orders => {
        this.ordersSignal.set(orders);
        this.loadingSignal.set(false);
      })
    );
  }

  selectOrder(order: Order): void {
    this.selectedOrderSignal.set(order);
  }

  clearSelection(): void {
    this.selectedOrderSignal.set(null);
  }

  setStatusFilter(status: string): void {
    this.statusFilterSignal.set(status);
  }

  updateOrderStatus(id: string, status: Order['status']): void {
    this.ordersSignal.update(orders =>
      orders.map(o => o.id === id ? { ...o, status } : o)
    );
  }

  deleteOrder(id: string): void {
    this.ordersSignal.update(orders => orders.filter(o => o.id !== id));
    this.totalItemsSignal.update(count => count - 1);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setOrders(orders: Order[]): void {
    this.ordersSignal.set(orders);
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
