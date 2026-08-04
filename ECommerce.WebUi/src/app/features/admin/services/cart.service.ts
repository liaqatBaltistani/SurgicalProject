import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CartApiService, Cart, CartItem, AddToCart, UpdateCartItem } from './cart-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartCount = signal(0);

  constructor(
    private cartApiService: CartApiService,
    private notificationService: NotificationService
  ) {}

  getCart(): Observable<Cart> {
    return this.cartApiService.getCart().pipe(
      tap((cart) => {
        this.cartCount.set(cart.items?.length || 0);
      })
    );
  }

  addToCart(item: AddToCart, notify = true): Observable<Cart> {
    return this.cartApiService.addToCart(item).pipe(
      tap((cart) => {
        if (notify) {
          this.notificationService.showProductAdded();
          this.cartCount.set(cart.items?.length || 0);
        }
      })
    );
  }

  updateCartItem(cartItemId: number, update: UpdateCartItem, notify = true): Observable<Cart> {
    return this.cartApiService.updateCartItem(cartItemId, update).pipe(
      tap((cart) => {
        if (notify) {
          this.notificationService.showQuantityUpdated();
          this.cartCount.set(cart.items?.length || 0);
        }
      })
    );
  }

  removeFromCart(cartItemId: number, notify = true): Observable<Cart> {
    return this.cartApiService.removeFromCart(cartItemId).pipe(
      tap((cart) => {
        if (notify) {
          this.notificationService.showProductRemoved();
          this.cartCount.set(cart.items?.length || 0);
        }
      })
    );
  }

  clearCart(notify = true): Observable<Cart> {
    return this.cartApiService.clearCart().pipe(
      tap((cart) => {
        if (notify) {
          this.notificationService.showCartCleared();
          this.cartCount.set(0);
        }
      })
    );
  }
}
