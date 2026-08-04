import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

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
export class CartApiService extends BaseApiService {
  getCart(): Observable<Cart> {
    return this.get<Cart>('Cart');
  }

  addToCart(item: AddToCart): Observable<Cart> {
    return this.post<Cart>('Cart/add', item);
  }

  updateCartItem(cartItemId: number, update: UpdateCartItem): Observable<Cart> {
    return this.put<Cart>(`Cart/items/${cartItemId}`, update);
  }

  removeFromCart(cartItemId: number): Observable<Cart> {
    return this.delete<Cart>(`Cart/items/${cartItemId}`);
  }

  clearCart(): Observable<Cart> {
    return this.delete<Cart>('Cart/clear');
  }
}
