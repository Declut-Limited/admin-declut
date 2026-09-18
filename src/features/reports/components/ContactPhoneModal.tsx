import { FiPhone, FiCopy, FiX } from "react-icons/fi";
import { showToast } from "@/lib/utils/toast";

interface ContactPhoneModalProps {
  phone: string;
  onClose: () => void;
}

export default function ContactPhoneModal({
  phone,
  onClose,
}: ContactPhoneModalProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      showToast.success("Number copied");
    } catch {
      showToast.error("Couldn't copy number");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-modal-overlay">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 animate-modal-content">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[#1D2939] dark:text-gray-100">
            Contact by Phone
          </h2>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer bg-[#1D2939] text-white dark:bg-gray-700"
            aria-label="Close"
          >
            <FiX className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 bg-[#EFF6FF] dark:bg-blue-950/30 rounded-xl px-3 py-2.5">
          <span className="flex items-center gap-2.5 text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
            <span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
              <FiPhone className="w-4 h-4 text-brand-blue" />
            </span>
            {phone}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-brand-blue hover:underline cursor-pointer shrink-0"
          >
            <FiCopy className="w-3.5 h-3.5" /> Copy Number
          </button>
        </div>
      </div>
    </div>
  );
}
