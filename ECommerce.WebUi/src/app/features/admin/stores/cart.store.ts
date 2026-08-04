import { Injectable, signal, computed } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CartService } from '../services/cart.service';
import { Cart, CartItem } from '../services/cart-api.service';

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private cartItemsSignal = signal<CartItem[]>([]);
  private isOpenSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);
  private addingSignal = signal<boolean>(false);
  private updatingSignal = signal<boolean>(false);
  private removingSignal = signal<boolean>(false);

  readonly cartItems = this.cartItemsSignal.asReadonly();
  readonly isOpen = this.isOpenSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly adding = this.addingSignal.asReadonly();
  readonly updating = this.updatingSignal.asReadonly();
  readonly removing = this.removingSignal.asReadonly();

  readonly itemCount = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => total + item.quantity, 0);
  });

  readonly totalAmount = computed(() => {
    return this.cartItemsSignal().reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  });

  constructor(private cartService: CartService) {}

  loadCart(): Observable<Cart> {
    this.loadingSignal.set(true);
    return this.cartService.getCart().pipe(
      tap(cart => {
        this.cartItemsSignal.set(cart.items);
        this.loadingSignal.set(false);
      })
    );
  }

  addItem(productId: number, quantity: number): Observable<Cart> {
    return this.cartService.addToCart({ productId, quantity }).pipe(
      tap(cart => {
        this.cartItemsSignal.set(cart.items);
      })
    );
  }

  removeItem(cartItemId: number): Observable<Cart> {
    return this.cartService.removeFromCart(cartItemId).pipe(
      tap(cart => {
        this.cartItemsSignal.set(cart.items);
      })
    );
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<Cart> {
    return this.cartService.updateCartItem(cartItemId, { quantity }).pipe(
      tap(cart => {
        this.cartItemsSignal.set(cart.items);
      })
    );
  }

  clearCart(): Observable<Cart> {
    return this.cartService.clearCart().pipe(
      tap(cart => {
        this.cartItemsSignal.set(cart.items);
      })
    );
  }

  toggleCart(): void {
    this.isOpenSignal.update(open => !open);
  }

  closeCart(): void {
    this.isOpenSignal.set(false);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  setCartItems(items: CartItem[]): void {
    this.cartItemsSignal.set(items);
  }

  setAdding(adding: boolean): void {
    this.addingSignal.set(adding);
  }

  setUpdating(updating: boolean): void {
    this.updatingSignal.set(updating);
  }

  setRemoving(removing: boolean): void {
    this.removingSignal.set(removing);
  }
}
