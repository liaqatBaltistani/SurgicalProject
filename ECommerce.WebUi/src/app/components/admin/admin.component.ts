import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  activeTab = 'products';
  products: any[] = [];
  orders: any[] = [];
  loading = false;
  
  // Product form
  showProductForm = false;
  editingProduct: any = null;
  productForm: any = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    imageUrl: '',
    categoryId: 1,
    isActive: true
  };

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
    this.loadProducts();
    this.loadOrders();
  }

  checkAdminAccess(): void {
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'Admin') {
      this.router.navigate(['/home']);
    }
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.success) {
          this.products = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (response) => {
        if (response.success) {
          this.orders = response.data;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  openProductForm(product?: any): void {
    if (product) {
      this.editingProduct = product;
      this.productForm = { ...product };
    } else {
      this.editingProduct = null;
      this.productForm = {
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        imageUrl: '',
        categoryId: 1,
        isActive: true
      };
    }
    this.showProductForm = true;
  }

  closeProductForm(): void {
    this.showProductForm = false;
    this.editingProduct = null;
    this.productForm = {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      imageUrl: '',
      categoryId: 1,
      isActive: true
    };
  }

  saveProduct(): void {
    this.loading = true;
    const action = this.editingProduct 
      ? this.productService.updateProduct(this.editingProduct.productId, this.productForm)
      : this.productService.createProduct(this.productForm);

    action.subscribe({
      next: (response) => {
        if (response.success) {
          this.closeProductForm();
          this.loadProducts();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error saving product:', error);
        this.loading = false;
      }
    });
  }

  deleteProduct(productId: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: (response) => {
          if (response.success) {
            this.loadProducts();
          }
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, { orderStatus: status }).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadOrders();
        }
      },
      error: (error) => {
        console.error('Error updating order:', error);
      }
    });
  }

  onOrderStatusChange(event: Event, orderId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    this.updateOrderStatus(orderId, selectElement.value);
  }
}
