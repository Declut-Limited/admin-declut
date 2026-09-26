import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { LuCalendarDays } from "react-icons/lu";

interface DatePickerProps {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  // ISO yyyy-mm-dd — days before this are disabled. Defaults to today, since
  // every current use of this picker is choosing a future/scheduling date.
  // Pass an explicit value to use a different bound, or "" to allow any date.
  minDate?: string;
}

const PANEL_HEIGHT_ESTIMATE = 320;
const PANEL_WIDTH = 256; // w-64

function toIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayIso() {
  return toIsoDate(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  );
}

export default function DatePicker({
  label,
  required,
  value,
  onChange,
  minDate = todayIso(),
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() =>
    value ? new Date(value) : new Date(),
  );
  const [position, setPosition] = useState({ top: 0, left: 0, openUpward: false });
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !panelRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const margin = 4;
    // measure the panel's real height (week rows vary 4-6 per month) instead
    // of relying on a fixed estimate, which left a gap when it overshot
    const panelHeight =
      panelRef.current.getBoundingClientRect().height || PANEL_HEIGHT_ESTIMATE;

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward =
      spaceBelow < panelHeight + margin && spaceAbove > spaceBelow;

    // clamp so the panel can never be pushed off any edge of the viewport,
    // even on a short window where neither side fully fits
    const top = Math.min(
      Math.max(
        openUpward ? rect.top - panelHeight - margin : rect.bottom + margin,
        margin,
      ),
      Math.max(window.innerHeight - panelHeight - margin, margin),
    );
    const left = Math.min(
      Math.max(rect.left, margin),
      Math.max(window.innerWidth - PANEL_WIDTH - margin, margin),
    );

    setPosition({ top, left, openUpward });
  }, [open, viewDate]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !ref.current?.contains(target) &&
        !panelRef.current?.contains(target)
      )
        setOpen(false);
    }

    function handleReposition() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = viewDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const selectedDate = value ? new Date(value) : null;
  const displayValue = selectedDate
    ? selectedDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "dd/mm/yyyy";
  const handleSelectDay = (day: number) => {
    const iso = toIsoDate(year, month, day);
    if (minDate && iso < minDate) return;
    onChange(iso);
    setOpen(false);
  };

  return (
    <div ref={ref}>
      {label && (
        <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
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

        {open &&
          createPortal(
            <div
              ref={panelRef}
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: PANEL_WIDTH,
              }}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-3 z-100"
            >
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(year, month - 1, 1))}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                  {monthLabel}
                </span>
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
                  const iso = toIsoDate(year, month, day);
                  const isDisabled = Boolean(minDate && iso < minDate);
                  const isSelected =
                    selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year;
                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelectDay(day)}
                      className={`w-8 h-8 rounded-full text-xs ${
                        isDisabled
                          ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                          : isSelected
                            ? "bg-brand-blue text-white font-medium"
                            : "text-brand-gray-dark dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body,
          )}
      </div>
    </div>
  );
}
