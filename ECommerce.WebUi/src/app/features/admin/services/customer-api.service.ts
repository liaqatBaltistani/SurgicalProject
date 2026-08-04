import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from './base-api.service';

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  createdDate: string;
}

export interface CustomerListResponse {
  data: Customer[];
  total: number;
  page: number;
  pageSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService extends BaseApiService {
  getCustomers(page: number = 1, pageSize: number = 10, search?: string): Observable<CustomerListResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    
    return this.get<CustomerListResponse>('customers', params);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.get<Customer>(`customers/${id}`);
  }

  createCustomer(customer: Partial<Customer>): Observable<Customer> {
    return this.post<Customer>('customers', customer);
  }

  updateCustomer(id: string, customer: Partial<Customer>): Observable<Customer> {
    return this.put<Customer>(`customers/${id}`, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.delete<void>(`customers/${id}`);
  }

  getCustomerOrders(id: string): Observable<any[]> {
    return this.get<any[]>(`customers/${id}/orders`);
  }
}
