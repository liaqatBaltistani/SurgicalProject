import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { NotificationService } from '../core/services/notification.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    tokenExpiration: string;
    refreshTokenExpiration: string;
    user: {
      userId: number;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {}

  login(credentials: LoginRequest, notify = true): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response) => {
        if (response.success && notify) {
          this.notificationService.showLoginSuccess();
        }
      })
    );
  }

  register(userData: RegisterRequest, notify = true): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap((response) => {
        if (response.success && notify) {
          this.notificationService.showRegistrationSuccess();
        }
      })
    );
  }

  logout(notify = true): Observable<any> {
    return this.apiService.post<any>('/auth/logout', {}).pipe(
      tap(() => {
        if (notify) {
          this.notificationService.showLogout();
        }
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.apiService.post<AuthResponse>('/auth/refresh-token', { refreshToken });
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Check if token is expired
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (tokenExpiration) {
      const expirationDate = new Date(tokenExpiration);
      return expirationDate > new Date();
    }
    return true;
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.data.token);
    localStorage.setItem('refreshToken', authResponse.data.refreshToken);
    localStorage.setItem('tokenExpiration', authResponse.data.tokenExpiration);
    localStorage.setItem('refreshTokenExpiration', authResponse.data.refreshTokenExpiration);
    localStorage.setItem('user', JSON.stringify(authResponse.data.user));
  }

  logoutClient(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('refreshTokenExpiration');
    localStorage.removeItem('user');
  }

  isTokenExpired(): boolean {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (!tokenExpiration) return true;
    
    const expirationDate = new Date(tokenExpiration);
    return expirationDate <= new Date();
  }

  isRefreshTokenExpired(): boolean {
    const refreshTokenExpiration = localStorage.getItem('refreshTokenExpiration');
    if (!refreshTokenExpiration) return true;
    
    const expirationDate = new Date(refreshTokenExpiration);
    return expirationDate <= new Date();
  }
}
