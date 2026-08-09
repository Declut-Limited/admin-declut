import type { ReactNode } from "react";
import { RiSearch2Line } from "react-icons/ri";

interface TableToolbarProps {
  label: string;
  count: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterSlot?: ReactNode; // date filter + Filters button go here
}

export default function TableToolbar({
  label,
  count,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterSlot,
}: TableToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide">
        {label} · {count}
      </p>

      <div className="flex items-center gap-2">
        <div className="relative">
          <RiSearch2Line className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-light w-4 h-4" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm placeholder:text-[#667085] focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        {filterSlot}
      </div>
    </div>
  );
}