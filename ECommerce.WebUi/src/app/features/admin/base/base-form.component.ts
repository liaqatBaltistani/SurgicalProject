import { Directive, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Directive()
export abstract class BaseFormComponent implements OnInit, OnDestroy {
  protected destroy$ = new Subject<void>();
  protected form!: FormGroup;
  protected loading = false;
  protected isEditMode = false;

  constructor(protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected abstract initializeForm(): void;

  protected abstract submitForm(): void;

  onSubmit(): void {
    if (this.form.valid) {
      this.submitForm();
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  onReset(): void {
    this.form.reset();
  }

  protected markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  protected setFormValues(values: any): void {
    this.form.patchValue(values);
  }
}
