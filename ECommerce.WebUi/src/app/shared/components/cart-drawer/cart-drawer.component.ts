import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartService } from '../../../services/cart.service';
import { ButtonComponent } from '../ui/button/button.component';
import { LoaderComponent } from '../ui/loader/loader.component';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, ButtonComponent, LoaderComponent],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.scss'],
  animations: [
    trigger('backdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class CartDrawerComponent {
  private router = inject(Router);
  private cartService = inject(CartService);

  open = signal(false);
  loading = signal(false);
  cart = signal<any>(null);

  cartItems = computed(() => this.cart()?.items || []);
  cartTotal = computed(() => this.cart()?.totalAmount || 0);
  cartCount = computed(() => this.cart()?.totalItems || 0);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.loadCart();
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  loadCart(): void {
    this.loading.set(true);
    this.cartService.getCart().subscribe({
      next: (response) => {
        if (response.success) {
          this.cart.set(response.data);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.loading.set(false);
      }
    });
  }

  close(): void {
    this.open.set(false);
  }

  updateQuantity(cartItemId: number, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.updateCartItem(cartItemId, { quantity }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCart();
        }
      },
      error: (error) => {
        console.error('Error updating cart item:', error);
      }
    });
  }

  removeItem(cartItemId: number): void {
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCart();
        }
      },
      error: (error) => {
        console.error('Error removing cart item:', error);
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCart();
        }
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
      }
    });
  }

  navigateToCheckout(): void {
    this.close();
    this.router.navigate(['/checkout']);
  }

  navigateToCartPage(): void {
    this.close();
    this.router.navigate(['/cart']);
  }

  getItemPrice(item: any): number {
    return (item.price || 0) * (item.quantity || 1);
  }

  onBackdropClick(): void {
    this.close();
  }
}
