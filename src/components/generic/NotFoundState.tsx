import type { ReactNode } from "react";

interface NotFoundStateProps {
  icon: ReactNode;
  message: string;
}

export default function NotFoundState({ icon, message }: NotFoundStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 bg-[#F6F6F6] dark:bg-gray-900 rounded-xl py-16">
      <span className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-sm">
        {icon}
      </span>
      <p className="text-sm text-brand-gray-light">{message}</p>
    </div>
  );
}