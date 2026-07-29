import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: any;
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  logout(): void {
    this.authService.logoutClient();
    this.router.navigate(['/login']);
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
          this.filteredProducts = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  searchProducts(): void {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = this.products;
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    );
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  addToCart(productId: number, event: Event): void {
    event.stopPropagation();
    this.cartService.addToCart({ productId, quantity: 1 }).subscribe({
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
