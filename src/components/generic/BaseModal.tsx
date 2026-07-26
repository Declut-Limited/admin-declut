import type { ReactNode } from "react";
import { IoIosCloseCircle } from "react-icons/io";

interface BaseModalProps {
  title: string;
  titleColor?: string;
  width?: string;
  height?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function BaseModal({
  title,
  titleColor = "text-[#1D2939] dark:text-gray-100",
  width = "max-w-2xl",
  height = "max-h-[85vh]",
  onClose,
  children,
  footer,
}: BaseModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-modal-overlay">
      <div className={`w-full ${width} ${height} bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col animate-modal-content`}>
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <h2 className={`text-base font-bold ${titleColor}`}>{title}</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <IoIosCloseCircle className="w-7 h-7 text-[#101828] dark:text-white" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

        {/* footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-gray-800 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}