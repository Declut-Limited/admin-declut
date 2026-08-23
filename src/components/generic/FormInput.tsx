import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
}

export default function FormInput({ label, required, className = "", ...rest }: FormInputProps) {
  return (
    <div>
      <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
        {label} {required && <span className="text-brand-blue text-xs font-medium tracking-wide">*</span>}
      </label>
      <input
        className={`w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-brand-gray-dark dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${className}`}
        {...rest}
      />
    </div>
  );
}