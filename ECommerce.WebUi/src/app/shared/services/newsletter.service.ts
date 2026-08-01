import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface NewsletterSubscription {
  email: string;
  subscribedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private readonly STORAGE_KEY = 'newsletter_subscribed';
  private readonly STORAGE_EMAIL_KEY = 'newsletter_email';

  constructor() {
    // Placeholder for future HTTP API integration
  }

  subscribe(email: string): Observable<{ success: boolean; message: string }> {
    // Placeholder implementation - will be replaced with HTTP API call
    try {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      localStorage.setItem(this.STORAGE_EMAIL_KEY, email);
      return of({ success: true, message: 'Successfully subscribed to newsletter' });
    } catch (e) {
      return of({ success: false, message: 'Failed to subscribe to newsletter' });
    }
  }

  unsubscribe(email: string): Observable<{ success: boolean; message: string }> {
    // Placeholder implementation - will be replaced with HTTP API call
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.STORAGE_EMAIL_KEY);
      return of({ success: true, message: 'Successfully unsubscribed from newsletter' });
    } catch (e) {
      return of({ success: false, message: 'Failed to unsubscribe from newsletter' });
    }
  }

  isSubscribed(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) === 'true';
  }

  getSubscribedEmail(): string | null {
    return localStorage.getItem(this.STORAGE_EMAIL_KEY);
  }
}
