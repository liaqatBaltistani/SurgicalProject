import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// MOCK SERVICE - No backend API currently exists for Settings
// This service provides mock data for the settings module
// TODO: Replace with real API integration when backend endpoint is available

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  timezone: string;
  maintenanceMode: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderConfirmation: boolean;
  shippingUpdates: boolean;
  promotionalEmails: boolean;
}

export interface PaymentSettings {
  stripeEnabled: boolean;
  paypalEnabled: boolean;
  cashOnDeliveryEnabled: boolean;
  stripePublicKey: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  getSiteSettings(): Observable<SiteSettings> {
    // Mock data - replace with API call when available
    const mockData: SiteSettings = {
      siteName: 'Surgical Supply',
      siteDescription: 'Medical supplies and equipment',
      contactEmail: 'contact@surgicalsupply.com',
      contactPhone: '+1234567890',
      currency: 'USD',
      timezone: 'UTC',
      maintenanceMode: false
    };
    return of(mockData);
  }

  getNotificationSettings(): Observable<NotificationSettings> {
    // Mock data - replace with API call when available
    const mockData: NotificationSettings = {
      emailNotifications: true,
      smsNotifications: false,
      orderConfirmation: true,
      shippingUpdates: true,
      promotionalEmails: false
    };
    return of(mockData);
  }

  getPaymentSettings(): Observable<PaymentSettings> {
    // Mock data - replace with API call when available
    const mockData: PaymentSettings = {
      stripeEnabled: true,
      paypalEnabled: true,
      cashOnDeliveryEnabled: true,
      stripePublicKey: 'pk_test_***'
    };
    return of(mockData);
  }

  updateSiteSettings(settings: SiteSettings): Observable<SiteSettings> {
    // Mock data - replace with API call when available
    return of(settings);
  }

  updateNotificationSettings(settings: NotificationSettings): Observable<NotificationSettings> {
    // Mock data - replace with API call when available
    return of(settings);
  }

  updatePaymentSettings(settings: PaymentSettings): Observable<PaymentSettings> {
    // Mock data - replace with API call when available
    return of(settings);
  }
}
