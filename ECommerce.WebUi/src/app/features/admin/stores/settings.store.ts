import { Injectable, signal } from '@angular/core';

export interface AppSettings {
  siteName: string;
  siteDescription: string;
  currency: string;
  timezone: string;
  language: string;
  enableNotifications: boolean;
  enableDarkMode: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsStore {
  private settingsSignal = signal<AppSettings>({
    siteName: 'Surgical Admin',
    siteDescription: 'Healthcare E-commerce Platform',
    currency: 'USD',
    timezone: 'UTC',
    language: 'en',
    enableNotifications: true,
    enableDarkMode: false
  });

  readonly settings = this.settingsSignal.asReadonly();

  updateSettings(updates: Partial<AppSettings>): void {
    this.settingsSignal.update(settings => ({ ...settings, ...updates }));
  }

  resetSettings(): void {
    this.settingsSignal.set({
      siteName: 'Surgical Admin',
      siteDescription: 'Healthcare E-commerce Platform',
      currency: 'USD',
      timezone: 'UTC',
      language: 'en',
      enableNotifications: true,
      enableDarkMode: false
    });
  }
}
