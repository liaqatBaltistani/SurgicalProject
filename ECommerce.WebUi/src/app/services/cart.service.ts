import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

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
  constructor(private apiService: ApiService) {}

  getCart(): Observable<any> {
    return this.apiService.get<any>('/cart');
  }

  addToCart(item: AddToCart): Observable<any> {
    return this.apiService.post<any>('/cart/add', item);
  }

  updateCartItem(cartItemId: number, update: UpdateCartItem): Observable<any> {
    return this.apiService.put<any>(`/cart/items/${cartItemId}`, update);
  }

  removeFromCart(cartItemId: number): Observable<any> {
    return this.apiService.delete<any>(`/cart/items/${cartItemId}`);
  }

  clearCart(): Observable<any> {
    return this.apiService.delete<any>('/cart/clear');
  }
}
