import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// MOCK SERVICE - No backend API currently exists for Dashboard
// This service provides mock data for the dashboard module
// TODO: Replace with real API integration when backend endpoint is available

export interface KPICard {
  icon: string;
  value: string;
  label: string;
  trend: number;
  color: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
}

export interface QuickAction {
  icon: string;
  label: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  getKPICards(): Observable<KPICard[]> {
    // Mock data - replace with API call when available
    const mockData: KPICard[] = [
      { icon: 'payments', value: '$45,231', label: 'Total Revenue', trend: 12.5, color: 'primary' },
      { icon: 'today', value: '$2,345', label: "Today's Revenue", trend: 8.2, color: 'success' },
      { icon: 'shopping_cart', value: '1,234', label: 'Total Orders', trend: -3.1, color: 'accent' },
      { icon: 'inventory_2', value: '456', label: 'Total Products', trend: 5.4, color: 'primary' },
      { icon: 'category', value: '23', label: 'Total Categories', trend: 0, color: 'warning' },
      { icon: 'people', value: '892', label: 'Total Customers', trend: 15.3, color: 'success' },
      { icon: 'warning', value: '12', label: 'Low Stock Products', trend: -20.5, color: 'danger' },
      { icon: 'pending', value: '45', label: 'Pending Orders', trend: 10.2, color: 'warning' },
      { icon: 'cancel', value: '8', label: 'Cancelled Orders', trend: -5.3, color: 'danger' },
      { icon: 'assignment_return', value: '3', label: 'Return Requests', trend: 2.1, color: 'accent' }
    ];
    return of(mockData);
  }

  getQuickActions(): Observable<QuickAction[]> {
    // Mock data - replace with API call when available
    const mockData: QuickAction[] = [
      { icon: 'add_circle', label: 'Add Product', path: '/admin/products/new' },
      { icon: 'category', label: 'Create Category', path: '/admin/categories' },
      { icon: 'local_offer', label: 'Create Discount', path: '/admin/discounts' },
      { icon: 'receipt_long', label: 'View Orders', path: '/admin/orders' },
      { icon: 'admin_panel_settings', label: 'Manage Users', path: '/admin/users' },
      { icon: 'assessment', label: 'Generate Report', path: '/admin/reports' }
    ];
    return of(mockData);
  }
}
