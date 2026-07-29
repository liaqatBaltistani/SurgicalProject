import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService, Product, ProductSearch } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = false;
  searchQuery = '';
  selectedCategory = 0;
  currentPage = 1;
  pageSize = 12;
  totalCount = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
          this.filteredProducts = response.data;
          this.totalCount = response.data.length;
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
    if (this.searchQuery.trim()) {
      const search: ProductSearch = {
        searchTerm: this.searchQuery,
        categoryId: this.selectedCategory || undefined,
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      };
      
      this.loading = true;
      this.productService.searchProducts(search).subscribe({
        next: (response) => {
          if (response.success) {
            this.filteredProducts = response.data.products;
            this.totalCount = response.data.totalCount;
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error searching products:', error);
          this.loading = false;
        }
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/products', productId]);
  }

  addToCart(productId: number): void {
    this.cartService.addToCart({ productId, quantity: 1 }).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Product added to cart!');
        } else {
          alert(response.message || 'Failed to add to cart');
        }
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to add to cart');
      }
    });
  }
}
