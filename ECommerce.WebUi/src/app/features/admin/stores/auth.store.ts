import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();

  readonly fullName = computed(() => {
    const user = this.currentUserSignal();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });

  readonly isAdmin = computed(() => {
    const user = this.currentUserSignal();
    return user?.role === 'admin';
  });

  login(email: string, password: string): Observable<User> {
    this.loadingSignal.set(true);
    // Simulate API call
    return of({
      id: '1',
      email,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      avatar: ''
    });
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  setUser(user: User): void {
    this.currentUserSignal.set(user);
    this.isAuthenticatedSignal.set(true);
  }

  setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }
}
