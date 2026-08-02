import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { NotificationService } from '../core/services/notification.service';

export interface CartItem {
  cartItemId: number;
  productId: number;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  stockQuantity: number;
}

export interface Cart {
  cartId: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}

export interface AddToCart {
  productId: number;
  quantity: number;
}

export interface UpdateCartItem {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartCount = signal(0);

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  getCart(): Observable<any> {
    return this.apiService.get<any>('/cart').pipe(
      tap((response) => {
        if (response.success) {
          this.cartCount.set(response.data.items?.length || 0);
        }
      })
    );
  }

  addToCart(item: AddToCart, notify = true): Observable<any> {
    return this.apiService.post<any>('/cart/add', item).pipe(
      tap((response) => {
        if (notify && response.success) {
          this.notificationService.showProductAdded();
          this.cartCount.set(response.data.items?.length || 0);
        }
      })
    );
  }

  updateCartItem(cartItemId: number, update: UpdateCartItem, notify = true): Observable<any> {
    return this.apiService.put<any>(`/cart/items/${cartItemId}`, update).pipe(
      tap((response) => {
        if (notify && response.success) {
          this.notificationService.showQuantityUpdated();
          this.cartCount.set(response.data.items?.length || 0);
        }
      })
    );
  }

  removeFromCart(cartItemId: number, notify = true): Observable<any> {
    return this.apiService.delete<any>(`/cart/items/${cartItemId}`).pipe(
      tap((response) => {
        if (notify && response.success) {
          this.notificationService.showProductRemoved();
          this.cartCount.set(response.data.items?.length || 0);
        }
      })
    );
  }

  clearCart(notify = true): Observable<any> {
    return this.apiService.delete<any>('/cart/clear').pipe(
      tap((response) => {
        if (notify && response.success) {
          this.notificationService.showCartCleared();
          this.cartCount.set(0);
        }
      })
    );
  }
}
