import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface CustomSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function CustomSelect({ label, value, options, onChange }: CustomSelectProps) {
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
    <div ref={ref}>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </p>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          {value}
          <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50 max-h-48 overflow-y-auto scrollbar-hide">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  value === option
                    ? "bg-[#DBEAFE] dark:bg-indigo-950 text-[#1E40AF] dark:text-indigo-400 font-medium"
                    : "text-gray-700 dark:text-gray-200"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}