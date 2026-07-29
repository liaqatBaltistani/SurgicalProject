import { HttpHandlerFn, HttpRequest, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError, from, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, filter, take, finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Skip token for auth endpoints
  if (request.url.includes('/auth/login') || request.url.includes('/auth/register')) {
    return next(request);
  }

  const token = localStorage.getItem('token');
  if (token) {
    request = addToken(request, token);
  }

  return next(request).pipe(
    catchError(error => {
      if (error.status === 401) {
        return handle401Error(request, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  if (isRefreshing) {
    // If already refreshing, wait for the refresh to complete
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(addToken(request, token));
      })
    );
  } else {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    // Check if refresh token is expired
    if (authService.isRefreshTokenExpired()) {
      authService.logoutClient();
      window.location.href = '/login';
      return throwError(() => new Error('Refresh token expired'));
    }

    return from(authService.refreshToken().toPromise()).pipe(
      switchMap((authResponse: any) => {
        isRefreshing = false;
        if (authResponse.success) {
          authService.saveAuthData(authResponse);
          refreshTokenSubject.next(authResponse.data.token);
          return next(addToken(request, authResponse.data.token));
        } else {
          authService.logoutClient();
          window.location.href = '/login';
          return throwError(() => new Error('Token refresh failed'));
        }
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logoutClient();
        window.location.href = '/login';
        return throwError(() => error);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  }
}
