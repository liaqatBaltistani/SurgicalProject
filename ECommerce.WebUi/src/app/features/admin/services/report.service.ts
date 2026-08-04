import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// MOCK SERVICE - No backend API currently exists for Reports
// This service provides mock data for the report module
// TODO: Replace with real API integration when backend endpoint is available

export interface Report {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'customer' | 'order';
  generatedDate: string;
  status: 'completed' | 'generating' | 'failed';
  downloadUrl?: string;
}

export interface ReportData {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  getReports(): Observable<Report[]> {
    // Mock data - replace with API call when available
    const mockData: Report[] = [
      { id: '1', name: 'Monthly Sales Report', type: 'sales', generatedDate: '2024-01-20', status: 'completed', downloadUrl: '/reports/sales-jan.pdf' },
      { id: '2', name: 'Inventory Report', type: 'inventory', generatedDate: '2024-01-15', status: 'completed', downloadUrl: '/reports/inventory-jan.pdf' },
      { id: '3', name: 'Customer Analysis', type: 'customer', generatedDate: '2024-01-10', status: 'completed', downloadUrl: '/reports/customer-jan.pdf' }
    ];
    return of(mockData);
  }

  generateSalesReport(period: string): Observable<Report> {
    // Mock data - replace with API call when available
    const mockReport: Report = {
      id: Date.now().toString(),
      name: `Sales Report - ${period}`,
      type: 'sales',
      generatedDate: new Date().toISOString().split('T')[0],
      status: 'generating'
    };
    return of(mockReport);
  }

  getReportData(reportId: string): Observable<ReportData> {
    // Mock data - replace with API call when available
    const mockData: ReportData = {
      period: 'January 2024',
      totalRevenue: 45231.50,
      totalOrders: 1234,
      averageOrderValue: 36.67,
      topProducts: [
        { name: 'Surgical Mask', quantity: 450, revenue: 7195.50 },
        { name: 'Sterile Gloves', quantity: 320, revenue: 9596.80 },
        { name: 'Medical Gown', quantity: 180, revenue: 5396.40 }
      ]
    };
    return of(mockData);
  }
}
