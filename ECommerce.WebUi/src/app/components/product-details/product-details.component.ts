import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: any = null;
  loading = false;
  error: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetails(+productId);
    } else {
      this.error = 'Product ID not found';
      this.router.navigate(['/products']);
    }
  }

  loadProductDetails(productId: number): void {
    this.loading = true;
    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        if (response.success) {
          this.product = response.data;
        } else {
          this.error = 'Failed to load product details';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading product details:', error);
        this.error = 'Failed to load product details';
        this.loading = false;
      }
    });
  }

  addToCart(): void {
    if (this.product && this.quantity > 0) {
      this.cartService.addToCart({ productId: this.product.productId, quantity: this.quantity }).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Product added to cart!');
          }
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
          alert('Failed to add product to cart');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  parseSpecifications(specs: string): any[] {
    try {
      return JSON.parse(specs);
    } catch {
      return [];
    }
  }
}
