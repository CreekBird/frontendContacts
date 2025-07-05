import { toast, ToastOptions, ToastContent } from 'react-toastify';

const toastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
};

export function toastInfo(message: ToastContent): void {
  toast.info(message, toastConfig);
}

export function toastSuccess(message: ToastContent): void {
  toast.success(message, toastConfig);
}

export function toastWarning(message: ToastContent): void {
  toast.warn(message, toastConfig);
}

export function toastError(message: ToastContent): void {
  toast.error(message, toastConfig);
}
