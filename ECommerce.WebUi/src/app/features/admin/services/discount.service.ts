import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DiscountApiService, Discount } from './discount-api.service';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  constructor(
    private discountApiService: DiscountApiService,
    private notificationService: NotificationService
  ) {}

  getDiscounts(): Observable<Discount[]> {
    return this.discountApiService.getDiscounts();
  }

  getDiscount(id: string): Observable<Discount> {
    return this.discountApiService.getDiscount(id);
  }

  getDiscountByCode(code: string): Observable<Discount> {
    return this.discountApiService.getDiscountByCode(code);
  }

  getActiveDiscounts(): Observable<Discount[]> {
    return this.discountApiService.getActiveDiscounts();
  }

  createDiscount(discount: Partial<Discount>): Observable<Discount> {
    return this.discountApiService.createDiscount(discount).pipe(
      tap(() => this.notificationService.success('Discount created successfully'))
    );
  }

  updateDiscount(id: string, discount: Partial<Discount>): Observable<Discount> {
    return this.discountApiService.updateDiscount(id, discount).pipe(
      tap(() => this.notificationService.success('Discount updated successfully'))
    );
  }

  deleteDiscount(id: string): Observable<void> {
    return this.discountApiService.deleteDiscount(id).pipe(
      tap(() => this.notificationService.info('Discount deleted successfully'))
    );
  }

  calculateDiscount(code: string, amount: number): Observable<{ discountAmount: number; finalAmount: number }> {
    return this.discountApiService.calculateDiscount(code, amount);
  }
}
