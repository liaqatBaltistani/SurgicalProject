import { HttpHandlerFn, HttpRequest, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { SKIP_NOTIFICATION, SKIP_LOADING } from '../constants/notification-tokens';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const skipLoading = request.context.get(SKIP_LOADING) || request.context.get(SKIP_NOTIFICATION);

  if (!skipLoading) {
    activeRequests++;
    showLoadingSpinner();
  }

  return next(request).pipe(
    finalize(() => {
      if (!skipLoading) {
        activeRequests--;
        if (activeRequests === 0) {
          hideLoadingSpinner();
        }
      }
    })
  );
};

function showLoadingSpinner(): void {
  // TODO: Implement global loading spinner
  // This could use a shared service or signal to show/hide a spinner component
  // For now, we'll use document.body to toggle a CSS class
  document.body.classList.add('loading');
}

function hideLoadingSpinner(): void {
  // TODO: Implement global loading spinner
  document.body.classList.remove('loading');
}
