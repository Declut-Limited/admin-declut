import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h1 className="text-2xl font-bold text-[#475467] dark:text-gray-100">{title}</h1>
        {subtitle && <p className="text-[16px] text-[#475467] dark:text-gray-400 mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}