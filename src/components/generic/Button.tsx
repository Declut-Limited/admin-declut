import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  children: ReactNode;
}

export default function Button({
  leftIcon,
  rightIcon,
  bgColor = "bg-transparent",
  textColor = "text-gray-700 dark:text-gray-200",
  borderColor = "border-gray-200 dark:border-gray-700",
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${bgColor} ${textColor} ${borderColor} ${className}`}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
}