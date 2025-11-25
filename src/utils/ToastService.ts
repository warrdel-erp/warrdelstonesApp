import Toast from 'react-native-toast-message';

export interface ToastConfig {
  title: string;
  message?: string;
  duration?: number;
  position?: 'top' | 'bottom';
}

/**
 * Toast utility service for showing toast messages throughout the app
 */
export class ToastService {
  /**
   * Show a success toast message
   * @param config - Toast configuration
   */
  static success(config: ToastConfig | string): void {
    const toastConfig = typeof config === 'string' ? { title: config } : config;

    Toast.show({
      type: 'success',
      text1: toastConfig.title,
      text2: toastConfig.message,
      position: toastConfig.position || 'top',
      visibilityTime: toastConfig.duration || 4000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
    });
  }

  /**
   * Show an error toast message
   * @param config - Toast configuration
   */
  static error(config: ToastConfig | string): void {
    const toastConfig = typeof config === 'string' ? { title: config } : config;

    Toast.show({
      type: 'error',
      text1: toastConfig.title,
      text2: toastConfig.message,
      position: toastConfig.position || 'top',
      visibilityTime: toastConfig.duration || 5000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
    });
  }

  /**
   * Show an info toast message
   * @param config - Toast configuration
   */
  static info(config: ToastConfig | string): void {
    const toastConfig = typeof config === 'string' ? { title: config } : config;

    Toast.show({
      type: 'info',
      text1: toastConfig.title,
      text2: toastConfig.message,
      position: toastConfig.position || 'top',
      visibilityTime: toastConfig.duration || 4000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
    });
  }

  /**
   * Show a warning toast message
   * @param config - Toast configuration
   */
  static warning(config: ToastConfig | string): void {
    const toastConfig = typeof config === 'string' ? { title: config } : config;

    Toast.show({
      type: 'info', // react-native-toast-message doesn't have warning type by default
      text1: toastConfig.title,
      text2: toastConfig.message,
      position: toastConfig.position || 'top',
      visibilityTime: toastConfig.duration || 4000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
    });
  }

  /**
   * Show a custom toast message
   * @param type - Toast type
   * @param config - Toast configuration
   */
  static custom(type: string, config: ToastConfig): void {
    Toast.show({
      type,
      text1: config.title,
      text2: config.message,
      position: config.position || 'top',
      visibilityTime: config.duration || 4000,
      autoHide: true,
      topOffset: 60,
      bottomOffset: 40,
    });
  }

  /**
   * Hide the currently visible toast
   */
  static hide(): void {
    Toast.hide();
  }

  /**
   * Show loading toast (stays until manually hidden)
   * @param message - Loading message
   */
  static loading(message: string = 'Loading...'): void {
    Toast.show({
      type: 'info',
      text1: message,
      position: 'top',
      visibilityTime: 0, // Don't auto hide
      autoHide: false,
      topOffset: 60,
    });
  }

  /**
   * Hide loading toast
   */
  static hideLoading(): void {
    Toast.hide();
  }
}

// Convenience methods for quick access
export const showSuccessToast = (message: string) => ToastService.success(message);
export const showErrorToast = (message: string) => ToastService.error(message);
export const showInfoToast = (message: string) => ToastService.info(message);
export const showWarningToast = (message: string) => ToastService.warning(message);

export default ToastService;
