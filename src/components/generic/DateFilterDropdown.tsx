import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import calendar from "../../assets/icons/calendar.svg"

interface DateFilterDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

export default function DateFilterDropdown({ value, options, onChange }: DateFilterDropdownProps) {
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
        <img src={calendar} className="w-4 h-4 transition-transform" />

        {value}
        <FiChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                value === option ? "text-indigo-600 font-medium" : "text-gray-700 dark:text-gray-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}