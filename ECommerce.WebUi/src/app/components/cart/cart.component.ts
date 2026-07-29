import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, Cart, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading = true;
    this.cartService.getCart().subscribe({
      next: (response) => {
        if (response.success) {
          this.cart = response.data;
        } else {
          this.errorMessage = response.message;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load cart';
        this.loading = false;
      }
    });
  }

  updateQuantity(cartItemId: number, quantity: number): void {
    if (quantity < 1) return;
    
    this.cartService.updateCartItem(cartItemId, { quantity }).subscribe({
      next: (response) => {
        if (response.success) {
          this.cart = response.data;
        }
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
      }
    });
  }

  removeFromCart(cartItemId: number): void {
    if (confirm('Are you sure you want to remove this item?')) {
      this.cartService.removeFromCart(cartItemId).subscribe({
        next: (response) => {
          if (response.success) {
            this.cart = response.data;
          }
        },
        error: (error) => {
          console.error('Error removing item:', error);
        }
      });
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe({
        next: (response) => {
          if (response.success) {
            this.cart = response.data;
          }
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
        }
      });
    }
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
