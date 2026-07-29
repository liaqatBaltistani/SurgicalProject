import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, Cart } from '../../services/cart.service';
import { OrderService, CreateOrder } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  loading = false;
  discountCode = '';
  discountApplied = false;
  discountAmount = 0;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
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
          if (!this.cart || this.cart.items.length === 0) {
            this.router.navigate(['/cart']);
          }
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to load cart';
        this.loading = false;
      }
    });
  }

  applyDiscount(): void {
    if (!this.discountCode.trim()) return;
    
    // Calculate discount locally for preview
    // In production, this would call the discount service
    this.discountApplied = true;
    this.discountAmount = (this.cart?.totalAmount ?? 0) * 0.1; // 10% discount example
  }

  removeDiscount(): void {
    this.discountCode = '';
    this.discountApplied = false;
    this.discountAmount = 0;
  }

  placeOrder(): void {
    if (!this.cart || this.cart.items.length === 0) {
      return;
    }

    this.loading = true;
    const order: CreateOrder = {
      discountCode: this.discountCode
    };

    this.orderService.createOrder(order).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/orders']);
        } else {
          this.errorMessage = response.message;
          this.loading = false;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to place order';
        this.loading = false;
      }
    });
  }

  get finalTotal(): number {
    if (!this.cart) return 0;
    return this.cart.totalAmount - this.discountAmount;
  }
}
