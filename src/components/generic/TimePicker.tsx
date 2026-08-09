import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiClock } from "react-icons/fi";
import { useDropdownPosition } from "@/lib/hooks/useDropdownPosition";

interface TimePickerProps {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  stepMinutes?: number;
}

function generateTimeOptions(stepMinutes: number) {
  const options: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      options.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return options;
}

export default function TimePicker({ label, required, value, onChange, stepMinutes = 30 }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const options = generateTimeOptions(stepMinutes);

  const openUpward = useDropdownPosition(triggerRef, open, 200);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref}>
      {label && (
        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span className="flex items-center gap-2">
            <FiClock className="w-4 h-4 text-[#535862]" />
            {value || "00:00"}
          </span>
          <FiChevronDown className={`w-4 h-4 text-[#535862] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div
            className={`absolute left-0 right-0 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50 max-h-48 overflow-y-auto scrollbar-hide ${
              openUpward ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
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
                    ? "bg-indigo-50 dark:bg-indigo-950 text-brand-blue font-medium"
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