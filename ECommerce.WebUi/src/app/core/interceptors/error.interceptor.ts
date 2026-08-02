import { HttpHandlerFn, HttpRequest, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { SKIP_NOTIFICATION } from '../constants/notification-tokens';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const notificationService = inject(NotificationService);
  const skipNotification = request.context.get(SKIP_NOTIFICATION);

  return next(request).pipe(
    catchError(error => {
      if (skipNotification) {
        return throwError(() => error);
      }

      handleHttpError(error, notificationService);
      return throwError(() => error);
    })
  );
};

function handleHttpError(error: any, notificationService: NotificationService): void {
  if (error.error instanceof ErrorEvent) {
    // Client-side or network error
    notificationService.showNetworkError();
    return;
  }

  // Server-side error
  const status = error.status;
  const errorData = error.error;

  switch (status) {
    case 0:
      // Network error
      notificationService.showNetworkError();
      break;

    case 400:
      // Bad Request - Validation errors
      handleValidationError(errorData, notificationService);
      break;

    case 401:
      // Unauthorized
      notificationService.showUnauthorizedError();
      break;

    case 403:
      // Forbidden
      notificationService.showForbiddenError();
      break;

    case 404:
      // Not Found
      notificationService.showNotFoundError();
      break;

    case 408:
      // Request Timeout
      notificationService.showRequestTimeout();
      break;

    case 429:
      // Too Many Requests
      notificationService.showTooManyRequests();
      break;

    case 500:
      // Internal Server Error
      notificationService.showServerError();
      break;

    case 503:
      // Service Unavailable - Maintenance
      notificationService.showMaintenanceMode();
      break;

    default:
      // Unknown error
      notificationService.showUnknownError();
  }
}

function handleValidationError(errorData: any, notificationService: NotificationService): void {
  const errors = parseValidationErrors(errorData);
  notificationService.showValidationError(errors);
}

function parseValidationErrors(errorData: any): string[] {
  if (!errorData) {
    return [];
  }

  // Support for ProblemDetails (RFC 7807)
  if (errorData.errors) {
    const errors: string[] = [];
    if (typeof errorData.errors === 'string') {
      errors.push(errorData.errors);
    } else if (Array.isArray(errorData.errors)) {
      errors.push(...errorData.errors);
    } else if (typeof errorData.errors === 'object') {
      Object.values(errorData.errors).forEach(value => {
        if (Array.isArray(value)) {
          errors.push(...value);
        } else if (typeof value === 'string') {
          errors.push(value);
        }
      });
    }
    return errors;
  }

  // Support for ApiResponse<T> format
  if (errorData.message) {
    return [errorData.message];
  }

  // Support for plain string
  if (typeof errorData === 'string') {
    return [errorData];
  }

  // Support for array of strings
  if (Array.isArray(errorData)) {
    return errorData.filter(item => typeof item === 'string');
  }

  // Support for ValidationProblemDetails with specific fields
  if (errorData.title) {
    return [errorData.title];
  }

  return [];
}
