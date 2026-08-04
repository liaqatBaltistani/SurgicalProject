import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// MOCK SERVICE - No backend API currently exists for Customers
// This service provides mock data for the customer module
// TODO: Replace with real API integration when backend endpoint is available

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  lastOrderDate: string;
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
export class CustomerService {
  getCustomers(page: number = 1, pageSize: number = 10): Observable<CustomerListResponse> {
    // Mock data - replace with API call when available
    const mockData: Customer[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1234567890', totalOrders: 5, totalSpent: 1250.00, status: 'active', lastOrderDate: '2024-01-20' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1234567891', totalOrders: 12, totalSpent: 3450.00, status: 'active', lastOrderDate: '2024-01-18' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+1234567892', totalOrders: 3, totalSpent: 450.00, status: 'inactive', lastOrderDate: '2024-01-10' }
    ];
    return of({ data: mockData, total: mockData.length, page, pageSize });
  }

  getCustomer(id: string): Observable<Customer> {
    // Mock data - replace with API call when available
    const mockCustomer: Customer = {
      id,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      totalOrders: 5,
      totalSpent: 1250.00,
      status: 'active',
      lastOrderDate: '2024-01-20'
    };
    return of(mockCustomer);
  }
}
