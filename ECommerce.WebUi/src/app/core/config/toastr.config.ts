import { provideToastr } from 'ngx-toastr';

export const toastrConfig = provideToastr({
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  countDuplicates: true,
  maxOpened: 3,
  autoDismiss: true,
  timeOut: 3000, // Default for success/info
  extendedTimeOut: 1000,
  enableHtml: false,
  closeButton: true,
  progressBar: true,
  progressAnimation: 'decreasing',
  toastClass: 'ngx-toastr',
  easing: 'ease-in',
  easeTime: 300,
  newestOnTop: true,
  tapToDismiss: true,
  titleClass: 'toast-title',
  messageClass: 'toast-message'
});

// Duration configuration by notification type
export const NotificationDurations = {
  success: 3000,
  info: 3000,
  warning: 5000,
  error: 6000
};
