import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { CartService, Cart, CartItem } from '../../services/cart.service';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { LoaderComponent } from '../../shared/components/ui/loader/loader.component';
import { BreadcrumbComponent } from '../../shared/components/ui/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, LoaderComponent, BreadcrumbComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class CartComponent implements OnInit {
  cart = signal<Cart | null>(null);
  loading = signal(false);
  errorMessage = signal('');

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading.set(true);
    this.cartService.getCart().subscribe({
      next: (response) => {
        if (response.success) {
          this.cart.set(response.data);
        } else {
          this.errorMessage.set(response.message);
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to load cart');
        this.loading.set(false);
      }
    });
  }

  updateQuantity(cartItemId: number, quantity: number): void {
    if (quantity < 1) return;
    
    this.cartService.updateCartItem(cartItemId, { quantity }).subscribe({
      next: (response) => {
        if (response.success) {
          this.cart.set(response.data);
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
            this.cart.set(response.data);
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
            this.cart.set(response.data);
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

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  getItemTotal(item: CartItem): number {
    return (item.unitPrice || 0) * (item.quantity || 1);
  }
}
