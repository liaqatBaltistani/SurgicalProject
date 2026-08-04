import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  status: string;
  createdDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiscountApiService extends BaseApiService {
  getDiscounts(): Observable<Discount[]> {
    return this.get<Discount[]>('Discount');
  }

  getDiscount(id: string): Observable<Discount> {
    return this.get<Discount>(`Discount/${id}`);
  }

  getDiscountByCode(code: string): Observable<Discount> {
    return this.get<Discount>(`Discount/code/${code}`);
  }

  getActiveDiscounts(): Observable<Discount[]> {
    return this.get<Discount[]>('Discount/active');
  }

  createDiscount(discount: Partial<Discount>): Observable<Discount> {
    return this.post<Discount>('Discount', discount);
  }

  updateDiscount(id: string, discount: Partial<Discount>): Observable<Discount> {
    return this.put<Discount>(`Discount/${id}`, discount);
  }

  deleteDiscount(id: string): Observable<void> {
    return this.delete<void>(`Discount/${id}`);
  }

  calculateDiscount(code: string, amount: number): Observable<{ discountAmount: number; finalAmount: number }> {
    return this.post<{ discountAmount: number; finalAmount: number }>('Discount/calculate', { code, amount });
  }
}
