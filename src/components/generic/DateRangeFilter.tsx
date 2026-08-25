import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import DatePicker from "./DatePicker";
import calendar from "../../assets/icons/calendar-grey.svg";

export interface DateRange {
  from: string;
  to: string;
}

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

function formatLabel(range: DateRange) {
  if (!range.from && !range.to) return "Date joined";
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  if (range.from && range.to) return `${fmt(range.from)} – ${fmt(range.to)}`;
  if (range.from) return `From ${fmt(range.from)}`;
  return `Until ${fmt(range.to)}`;
}

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasValue = Boolean(value.from || value.to);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 whitespace-nowrap"
      >
        <img src={calendar} className="w-4 h-4" />
        <span className={hasValue ? "" : "text-brand-gray-light"}>{formatLabel(value)}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-3 z-50 flex flex-col gap-3">
          <DatePicker
            label="From"
            value={value.from}
            onChange={(from) => onChange({ ...value, from })}
          />

          <DatePicker
            label="To"
            value={value.to}
            onChange={(to) => onChange({ ...value, to })}
          />

          <button
            type="button"
            onClick={() => {
              onChange({ from: "", to: "" });
              setOpen(false);
            }}
            className="text-xs text-red-500 hover:underline cursor-pointer self-start"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}