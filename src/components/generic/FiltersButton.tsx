import { useState, useRef, useEffect, type ReactNode } from "react";
import { RiFilter2Fill } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";

interface FiltersButtonProps {
  children: ReactNode;
  activeCount?: number;
}

export default function FiltersButton({ children, activeCount = 0 }: FiltersButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <RiFilter2Fill className="w-4 h-4 text-[#454545]" />
        Filters
        {activeCount > 0 && (
          <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <FiChevronDown className={`w-4 h-4 text-[#475467] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-50">
          {children}
        </div>
      )}
    </div>
  );
}