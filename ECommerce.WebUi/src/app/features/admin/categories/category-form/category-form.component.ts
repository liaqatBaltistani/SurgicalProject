import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';

import { CategoryService } from '../../services/category.service';
import { CategoryStore } from '../../stores/category.store';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'admin-category-form',
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
  templateUrl: './category-form.component.html',
  styleUrls: []
})
export class CategoryFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private categoryStore = inject(CategoryStore);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categoryForm: FormGroup;
  isSubmitting = false;
  categoryId: string | null = null;
  categories$ = this.categoryService.getCategories();

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      parentCategoryId: [null],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryId = id;
    if (this.categoryId) {
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: string): void {
    this.categoryService.getCategory(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description,
          parentCategoryId: category.parentCategoryId,
          isActive: category.isActive
        });
      },
      error: () => {
        this.notificationService.error('Failed to load category');
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.categoryStore.setSaving(true);

    const formData = this.categoryForm.value;

    if (this.categoryId) {
      this.categoryService.updateCategory(this.categoryId, formData).subscribe({
        next: () => {
          this.categoryStore.setSaving(false);
          this.isSubmitting = false;
          this.notificationService.success('Category updated successfully');
          this.categoryStore.loadCategories().subscribe();
          this.router.navigate(['/admin/categories']);
        },
        error: () => {
          this.categoryStore.setSaving(false);
          this.isSubmitting = false;
        }
      });
    } else {
      this.categoryService.createCategory(formData).subscribe({
        next: () => {
          this.categoryStore.setSaving(false);
          this.isSubmitting = false;
          this.notificationService.success('Category created successfully');
          this.categoryStore.loadCategories().subscribe();
          this.router.navigate(['/admin/categories']);
        },
        error: () => {
          this.categoryStore.setSaving(false);
          this.isSubmitting = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/categories']);
  }

  get name() { return this.categoryForm.get('name'); }
  get description() { return this.categoryForm.get('description'); }
  get parentCategoryId() { return this.categoryForm.get('parentCategoryId'); }
  get isActive() { return this.categoryForm.get('isActive'); }
}
