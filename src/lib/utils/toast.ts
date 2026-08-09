import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  description?: string;
}

export const showToast = {
  success: (title: string, options?: ToastOptions) =>
    sonnerToast.success(title, { ...options, icon: null }),
  error: (title: string, options?: ToastOptions) =>
    sonnerToast.error(title, { ...options, icon: null }),
  info: (title: string, options?: ToastOptions) =>
    sonnerToast.info(title, { ...options, icon: null }),
  warning: (title: string, options?: ToastOptions) =>
    sonnerToast.warning(title, { ...options, icon: null }),
};

//USAGE
// showToast.success("Reminder Sent successfully!", {
//   description: "A reminder has been sent to the user to make payment.",
// });

// showToast.error("Refund failed", {
//   description: "Something went wrong processing the refund.",
// });

// showToast.info("Export started", {
//   description: "Your export will be ready shortly.",
// });

// showToast.warning("Action requires review", {
//   description: "This transaction has an open dispute.",
// });