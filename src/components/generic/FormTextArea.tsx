import type { TextareaHTMLAttributes } from "react";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
}

export default function FormTextarea({ label, required, className = "", ...rest }: FormTextareaProps) {
  return (
    <div>
      <label className="block text-xs text-[#475467] dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-[#2563EB] text-xs font-medium tracking-wide">*</span>}
      </label>
      <textarea
        className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${className}`}
        {...rest}
      />
    </div>
  );
}