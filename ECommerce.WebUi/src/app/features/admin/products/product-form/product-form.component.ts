import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { ProductStore } from '../../stores/product.store';
import { NotificationService } from '../../../../core/services/notification.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'admin-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule
  ],
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private productStore = inject(ProductStore);
  private notificationService = inject(NotificationService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm: FormGroup;
  isSubmitting = false;
  categories$ = this.categoryService.getCategories();
  categories: any[] = [];
  productId: string | null = null;

  constructor() {
    this.productForm = this.fb.group({
      sku: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      categoryId: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id;
    
    // Load categories and store in local array
    this.categories$.subscribe({
      next: (categories) => {
        this.categories = categories;
        console.log('Categories loaded in product form:', categories);
        console.log('Number of categories:', categories.length);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
    
    if (this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          sku: product.sku,
          name: product.name,
          categoryId: product.categoryId,
          description: product.description || '',
          price: product.price,
          stockQuantity: product.stockQuantity,
          imageUrl: product.imageUrl || '',
          isActive: product.isActive
        });
      },
      error: () => {
        this.notificationService.error('Failed to load product');
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.productStore.setSaving(true);

    const formData = this.productForm.value;

    if (this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: () => {
          this.productStore.setSaving(false);
          this.isSubmitting = false;
          this.notificationService.success('Product updated successfully');
          this.productStore.loadProducts(1, 10).subscribe();
          this.router.navigate(['/admin/products']);
        },
        error: () => {
          this.productStore.setSaving(false);
          this.isSubmitting = false;
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.productStore.setSaving(false);
          this.isSubmitting = false;
          this.notificationService.success('Product created successfully');
          this.productStore.loadProducts(1, 10).subscribe();
          this.router.navigate(['/admin/products']);
        },
        error: () => {
          this.productStore.setSaving(false);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  clearImage(): void {
    this.productForm.patchValue({ imageUrl: '' });
  }

  onImageError(): void {
    this.notificationService.error('Failed to load image');
  }

  get sku() { return this.productForm.get('sku'); }
  get name() { return this.productForm.get('name'); }
  get categoryId() { return this.productForm.get('categoryId'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get stockQuantity() { return this.productForm.get('stockQuantity'); }
  get imageUrl() { return this.productForm.get('imageUrl'); }
  get isActive() { return this.productForm.get('isActive'); }
}
