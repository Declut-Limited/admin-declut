import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface CustomSelectProps {
  label?: string;
  required?: boolean;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function CustomSelect({
  label,
  required,
  value,
  options,
  onChange,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref}>
      {label && (
        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1.5">
          {label}{" "}
          {required && (
            <span className="text-brand-blue text-xs font-medium tracking-wide">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          title={value}
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span className="truncate">{value}</span>
          <FiChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
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
                    ? "bg-indigo-50 dark:bg-indigo-950 text-brand-blue dark:text-indigo-400 font-medium"
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
