import { toast, ToastOptions, ToastContent } from "react-toastify";

/** Common configuration applied to every toast */
const toastConfig: ToastOptions = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

/** Shorthand helpers */
export const toastInfo = (message: ToastContent): void => {
  toast.info(message, toastConfig);
};

export const toastSuccess = (message: ToastContent): void => {
  toast.success(message, toastConfig);
};

export const toastWarning = (message: ToastContent): void => {
  toast.warn(message, toastConfig);
};

export const toastError = (message: ToastContent): void => {
  toast.error(message, toastConfig);
};
