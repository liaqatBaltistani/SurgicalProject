import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationDurations } from '../config/toastr.config';
import { NotificationLevel } from '../constants/notification-levels';
import { CartMessages } from '../constants/messages/cart-messages';
import { AuthMessages } from '../constants/messages/auth-messages';
import { ProductMessages } from '../constants/messages/product-messages';
import { OrderMessages } from '../constants/messages/order-messages';
import { UserMessages } from '../constants/messages/user-messages';
import { SystemMessages } from '../constants/messages/system-messages';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // TODO: Add environment support - use environment.production when environment files are created
  private isDevelopment = true;

  constructor(private toastr: ToastrService) {}

  // Generic Methods
  success(message: string, title?: string): void {
    console.log('NotificationService.success called:', message);
    this.log(NotificationLevel.Success, message);
    this.toastr.success(message, title, {
      timeOut: NotificationDurations.success
    });
  }

  warning(message: string, title?: string): void {
    this.log(NotificationLevel.Warning, message);
    this.toastr.warning(message, title, {
      timeOut: NotificationDurations.warning
    });
  }

  error(message: string, title?: string): void {
    this.log(NotificationLevel.Error, message);
    this.toastr.error(message, title, {
      timeOut: NotificationDurations.error,
      disableTimeOut: false
    });
  }

  info(message: string, title?: string): void {
    this.log(NotificationLevel.Info, message);
    this.toastr.info(message, title, {
      timeOut: NotificationDurations.info
    });
  }

  // Cart Notifications
  showProductAdded(): void {
    this.success(CartMessages.PRODUCT_ADDED);
  }

  showProductRemoved(): void {
    this.info(CartMessages.PRODUCT_REMOVED);
  }

  showQuantityUpdated(): void {
    this.success(CartMessages.QUANTITY_UPDATED);
  }

  showCartCleared(): void {
    this.info(CartMessages.CART_CLEARED);
  }

  showCartRestored(): void {
    this.success(CartMessages.CART_RESTORED);
  }

  showProductAlreadyInCart(): void {
    this.warning(CartMessages.PRODUCT_ALREADY_IN_CART);
  }

  showEmptyCartCheckout(): void {
    this.warning(CartMessages.EMPTY_CART_CHECKOUT);
  }

  // Auth Notifications
  showLoginSuccess(): void {
    this.success(AuthMessages.LOGIN_SUCCESS);
  }

  showRegistrationSuccess(): void {
    this.success(AuthMessages.REGISTRATION_SUCCESS);
  }

  showLogout(): void {
    this.info(AuthMessages.LOGOUT);
  }

  showPasswordResetEmailSent(): void {
    this.success(AuthMessages.PASSWORD_RESET_EMAIL_SENT);
  }

  showInvalidCredentials(): void {
    this.error(AuthMessages.INVALID_CREDENTIALS);
  }

  showSessionExpired(): void {
    this.warning(AuthMessages.SESSION_EXPIRED);
  }

  showAccountVerified(): void {
    this.success(AuthMessages.ACCOUNT_VERIFIED);
  }

  showPasswordChanged(): void {
    this.success(AuthMessages.PASSWORD_CHANGED);
  }

  // Product Notifications
  showProductAddedToWishlist(): void {
    this.success(ProductMessages.ADDED_TO_WISHLIST);
  }

  showProductRemovedFromWishlist(): void {
    this.info(ProductMessages.REMOVED_FROM_WISHLIST);
  }

  showProductCreated(): void {
    this.success(ProductMessages.PRODUCT_CREATED);
  }

  showProductUpdated(): void {
    this.success(ProductMessages.PRODUCT_UPDATED);
  }

  showProductDeleted(): void {
    this.info(ProductMessages.PRODUCT_DELETED);
  }

  showCategoryCreated(): void {
    this.success(ProductMessages.CATEGORY_CREATED);
  }

  showCategoryUpdated(): void {
    this.success(ProductMessages.CATEGORY_UPDATED);
  }

  showCategoryDeleted(): void {
    this.info(ProductMessages.CATEGORY_DELETED);
  }

  showLowStockWarning(): void {
    this.warning(ProductMessages.LOW_STOCK_WARNING);
  }

  showOutOfStock(): void {
    this.error(ProductMessages.OUT_OF_STOCK);
  }

  // Order Notifications
  showOrderPlaced(): void {
    this.success(OrderMessages.ORDER_PLACED);
  }

  showOrderCancelled(): void {
    this.info(OrderMessages.ORDER_CANCELLED);
  }

  showOrderStatusUpdated(): void {
    this.info(OrderMessages.ORDER_STATUS_UPDATED);
  }

  showCheckoutFailed(): void {
    this.error(OrderMessages.CHECKOUT_FAILED);
  }

  showPaymentSuccessful(): void {
    this.success(OrderMessages.PAYMENT_SUCCESSFUL);
  }

  showPaymentFailed(): void {
    this.error(OrderMessages.PAYMENT_FAILED);
  }

  showOrderShipped(): void {
    this.info(OrderMessages.ORDER_SHIPPED);
  }

  showOrderDelivered(): void {
    this.success(OrderMessages.ORDER_DELIVERED);
  }

  // User Notifications
  showProfileUpdated(): void {
    this.success(UserMessages.PROFILE_UPDATED);
  }

  showAddressSaved(): void {
    this.success(UserMessages.ADDRESS_SAVED);
  }

  showAddressDeleted(): void {
    this.info(UserMessages.ADDRESS_DELETED);
  }

  showUserPasswordChanged(): void {
    this.success(UserMessages.PASSWORD_CHANGED);
  }

  showEmailUpdated(): void {
    this.success(UserMessages.EMAIL_UPDATED);
  }

  showPhoneUpdated(): void {
    this.success(UserMessages.PHONE_UPDATED);
  }

  showAvatarUpdated(): void {
    this.success(UserMessages.AVATAR_UPDATED);
  }

  showAccountDeleted(): void {
    this.info(UserMessages.ACCOUNT_DELETED);
  }

  // System Notifications
  showNetworkError(): void {
    this.error(SystemMessages.NETWORK_ERROR);
  }

  showServerError(): void {
    this.error(SystemMessages.SERVER_ERROR);
  }

  showUnauthorizedError(): void {
    this.error(SystemMessages.UNAUTHORIZED_ACCESS);
  }

  showForbiddenError(): void {
    this.error(SystemMessages.PERMISSION_DENIED);
  }

  showNotFoundError(): void {
    this.error(SystemMessages.RESOURCE_NOT_FOUND);
  }

  showValidationError(errors: string[]): void {
    if (errors.length === 0) {
      this.error(SystemMessages.VALIDATION_ERROR);
      return;
    }

    if (errors.length === 1) {
      this.error(errors[0]);
      return;
    }

    // Multiple errors - show first with summary
    const firstError = errors[0];
    const remainingCount = errors.length - 1;
    const message = `${firstError} (${remainingCount} more error${remainingCount > 1 ? 's' : ''})`;
    this.error(message);
  }

  showUnknownError(): void {
    this.error(SystemMessages.UNKNOWN_ERROR);
  }

  showRequestTimeout(): void {
    this.error(SystemMessages.REQUEST_TIMEOUT);
  }

  showTooManyRequests(): void {
    this.warning(SystemMessages.TOO_MANY_REQUESTS);
  }

  showMaintenanceMode(): void {
    this.warning(SystemMessages.MAINTENANCE_MODE);
  }

  // Private helper for logging
  private log(level: NotificationLevel, message: string): void {
    if (this.isDevelopment) {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }
}
