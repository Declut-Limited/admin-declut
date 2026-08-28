// components/generic/DateRangeFilter.tsx
import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import calendar from "../../assets/icons/calendar-grey.svg";

export interface DateRange {
  from: string;
  to: string;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "Last 2 months",
  "Last 3 months",
  "Last 6 months",
  "Last 12 months",
  "Custom",
] as const;

type Preset = (typeof PRESETS)[number];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toIso(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function addMonths(date: Date, months: number) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
}

function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function parseIso(iso: string): Date | null {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatInput(iso: string) {
  const date = parseIso(iso);
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day} / ${month} / ${date.getFullYear()}`;
}

function rangeForPreset(preset: Preset): DateRange | null {
  const today = startOfDay(new Date());

  switch (preset) {
    case "Today":
      return { from: toIso(today), to: toIso(today) };
    case "Yesterday": {
      const yesterday = addDays(today, -1);
      return { from: toIso(yesterday), to: toIso(yesterday) };
    }
    case "Last 7 days":
      return { from: toIso(addDays(today, -6)), to: toIso(today) };
    case "Last 30 days":
      return { from: toIso(addDays(today, -29)), to: toIso(today) };
    case "Last 2 months":
      return { from: toIso(addMonths(today, -2)), to: toIso(today) };
    case "Last 3 months":
      return { from: toIso(addMonths(today, -3)), to: toIso(today) };
    case "Last 6 months":
      return { from: toIso(addMonths(today, -6)), to: toIso(today) };
    case "Last 12 months":
      return { from: toIso(addMonths(today, -12)), to: toIso(today) };
    default:
      return null;
  }
}

function formatLabel(range: DateRange) {
  if (!range.from && !range.to) return "Select date";
  const fmt = (iso: string) => {
    const date = parseIso(iso);
    if (!date) return "";
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  if (range.from && range.to) return `${fmt(range.from)} – ${fmt(range.to)}`;
  if (range.from) return `From ${fmt(range.from)}`;
  return `Until ${fmt(range.to)}`;
}

export default function DateRangeFilter({
  value,
  onChange,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange>(value);
  const [preset, setPreset] = useState<Preset>("Custom");
  const [viewDate, setViewDate] = useState(
    () => parseIso(value.from) ?? new Date(),
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openPicker = () => {
    setDraft(value);
    setViewDate(parseIso(value.from) ?? new Date());
    setOpen(true);
  };

  const from = parseIso(draft.from);
  const to = parseIso(draft.to);
  const today = startOfDay(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = viewDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { date: Date; outside: boolean }[] = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      outside: true,
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), outside: false });
  }
  while (cells.length % 7 !== 0) {
    const nextDay = cells.length - firstDayOfMonth - daysInMonth + 1;
    cells.push({ date: new Date(year, month + 1, nextDay), outside: true });
  }

  const handleSelectDay = (date: Date) => {
    setPreset("Custom");

    if (!from || (from && to)) {
      setDraft({ from: toIso(date), to: "" });
      return;
    }

    if (date < from) {
      setDraft({ from: toIso(date), to: draft.from });
      return;
    }

    setDraft({ ...draft, to: toIso(date) });
  };

  const handlePreset = (next: Preset) => {
    setPreset(next);
    const range = rangeForPreset(next);
    if (range) {
      setDraft(range);
      setViewDate(parseIso(range.to) ?? new Date());
    }
  };

  const handleApply = () => {
    onChange(draft);
    setOpen(false);
  };

  const handleReset = () => {
    setDraft({ from: "", to: "" });
    setPreset("Custom");
    onChange({ from: "", to: "" });
    setOpen(false);
  };

  const hasValue = Boolean(value.from || value.to);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap"
      >
        <img src={calendar} className="w-4 h-4" />
        <span className={hasValue ? "" : "text-brand-gray-light"}>
          {formatLabel(value)}
        </span>
        <FiChevronDown
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="range-picker">
          <div className="range-picker-presets">
            {PRESETS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handlePreset(item)}
                className={`range-picker-preset ${
                  preset === item ? "range-picker-preset-active" : ""
                }`}
              >
                {preset === item && (
                  <BsCheckCircleFill className="w-4 h-4 text-brand-blue shrink-0" />
                )}
                {item}
              </button>
            ))}
          </div>

          <div className="range-picker-body">
            <div className="range-picker-inputs">
              <div
                className={`range-picker-input ${
                  !to ? "range-picker-input-active" : ""
                }`}
              >
                {formatInput(draft.from) || "DD / MM / YYYY"}
              </div>
              <span className="range-picker-arrow">→</span>
              <div
                className={`range-picker-input ${
                  from && !to ? "range-picker-input-active" : ""
                }`}
              >
                {formatInput(draft.to) || "DD / MM / YYYY"}
              </div>
            </div>

            <div className="range-picker-month-bar">
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="range-picker-nav"
                aria-label="Previous month"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>
              <span className="range-picker-month-label">{monthLabel}</span>
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="range-picker-nav"
                aria-label="Next month"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="range-picker-weekdays">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="range-picker-grid">
              {cells.map(({ date, outside }, index) => {
                const isStart = isSameDay(date, from);
                const isEnd = isSameDay(date, to);
                const inRange =
                  Boolean(from && to) && date > from! && date < to!;
                const isToday = isSameDay(date, today);

                return (
                  <div
                    key={index}
                    className={`range-picker-cell ${
                      inRange ? "range-picker-cell-in-range" : ""
                    } ${isStart && to ? "range-picker-cell-start" : ""} ${
                      isEnd ? "range-picker-cell-end" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectDay(date)}
                      className={`range-picker-day ${
                        outside ? "range-picker-day-outside" : ""
                      } ${
                        isStart || isEnd ? "range-picker-day-selected" : ""
                      } ${
                        isToday && !isStart && !isEnd
                          ? "range-picker-day-today"
                          : ""
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="range-picker-footer">
              {(value.from || value.to) && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="range-picker-reset"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="range-picker-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="range-picker-apply"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
