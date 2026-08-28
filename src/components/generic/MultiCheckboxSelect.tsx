import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

interface MultiCheckboxSelectProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
}

export default function MultiCheckboxSelect({
  label,
  required,
  placeholder = "Select",
  value,
  options,
  onChange,
}: MultiCheckboxSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (option: string) => {
    onChange(
      value.includes(option)
        ? value.filter((v) => v !== option)
        : [...value, option],
    );
  };

  return (
    <div ref={ref}>
      {label && (
        <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
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
          className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span className={`truncate ${value.length ? "" : "text-gray-400"}`}>
            {value.length ? value.join(", ") : placeholder}
          </span>
          <FiChevronDown
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {open && (
          <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50 max-h-48 overflow-y-auto">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={() => toggle(option)}
                  className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                />
                {option}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}