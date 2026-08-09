import { useState, useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useDropdownPosition } from "@/lib/hooks/useDropdownPosition";
import { LuCalendarDays } from "react-icons/lu";

interface DatePickerProps {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}

export default function DatePicker({ label, required, value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => (value ? new Date(value) : new Date()));
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const openUpward = useDropdownPosition(triggerRef, open, 320);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewDate.toLocaleString("default", { month: "long", year: "numeric" });
  const selectedDate = value ? new Date(value) : null;
  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "dd/mm/yyyy";

  const handleSelectDay = (day: number) => {
    const picked = new Date(year, month, day);
    const iso = picked.toISOString().split("T")[0];
    onChange(iso);
    setOpen(false);
  };

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
          <span className={value ? "" : "text-gray-400"}>{displayValue}</span>
          <LuCalendarDays className="w-4 h-4 text-[#535862] shrink-0" />
        </button>

        {open && (
          <div
            className={`absolute left-0 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-3 z-50 ${
              openUpward ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">{monthLabel}</span>
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-brand-gray-light mb-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <span key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected =
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`w-8 h-8 rounded-full text-xs ${
                      isSelected
                        ? "bg-brand-blue text-white font-medium"
                        : "text-brand-gray-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}