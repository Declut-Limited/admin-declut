import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TableToolbar from "@/components/generic/TableToolbar";
import Pagination from "@/components/generic/Pagination";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import DateRangeFilter, { type DateRange } from "@/components/generic/DateRangeFilter";
import FeedbackTable from "./FeedbackTable";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import { mockFeedbackRows, needsAttentionFilters, statusLabels, typeLabels } from "../mockData";

const statusOptions = ["All Statuses", ...Object.values(statusLabels)];
const typeOptions = ["All Types", ...Object.values(typeLabels)];

export default function AllFeedbackTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeNaFilter, setActiveNaFilter] = useState(
    () => needsAttentionFilters.find((f) => f.key === searchParams.get("na")) ?? null,
  );

  const clearNaFilter = () => {
    setActiveNaFilter(null);
    const next = new URLSearchParams(searchParams);
    next.delete("na");
    setSearchParams(next, { replace: true });
    setCurrentPage(1);
  };

  const visibleRows = useMemo(() => {
    return mockFeedbackRows.filter((row) => {
      if (activeNaFilter && !activeNaFilter.predicate(row)) return false;

      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        row.userName.toLowerCase().includes(q) ||
        row.userEmail.toLowerCase().includes(q) ||
        row.message.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q);

      const matchesStatus = !statusFilter || statusLabels[row.status] === statusFilter;
      const matchesType = !typeFilter || typeLabels[row.type] === typeFilter;

      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const submitted = new Date(row.submittedAt).getTime();
        if (Number.isNaN(submitted)) matchesDate = false;
        else {
          if (dateRange.from && submitted < new Date(dateRange.from).setHours(0, 0, 0, 0))
            matchesDate = false;
          if (dateRange.to && submitted > new Date(dateRange.to).setHours(23, 59, 59, 999))
            matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [search, statusFilter, typeFilter, dateRange, activeNaFilter]);

  const totalPages = Math.max(1, Math.ceil(visibleRows.length / PAGE_SIZE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleRows.slice(start, start + PAGE_SIZE);
  }, [visibleRows, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const activeFilterCount = (statusFilter ? 1 : 0) + (typeFilter ? 1 : 0);

  return (
    <div>
      {activeNaFilter && (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 rounded-lg px-4 py-2.5 mb-3">
          <p className="text-sm text-brand-blue dark:text-blue-400">
            Filtered: <span className="font-semibold">{activeNaFilter.label}</span>
          </p>
          <button
            onClick={clearNaFilter}
            className="text-xs text-brand-blue hover:underline cursor-pointer"
          >
            Clear filter
          </button>
        </div>
      )}

      <TableToolbar
        label="All Feedback"
        count={visibleRows.length}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search feedback..."
        filterSlot={
          <>
            <DateRangeFilter
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                setCurrentPage(1);
              }}
            />
            <FiltersButton activeCount={activeFilterCount}>
              <div className="flex flex-col gap-3">
                <CustomSelect
                  label="Status"
                  value={statusFilter || "All Statuses"}
                  options={statusOptions}
                  onChange={(val) => {
                    setStatusFilter(val === "All Statuses" ? "" : val);
                    setCurrentPage(1);
                  }}
                />
                <CustomSelect
                  label="Type"
                  value={typeFilter || "All Types"}
                  options={typeOptions}
                  onChange={(val) => {
                    setTypeFilter(val === "All Types" ? "" : val);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </FiltersButton>
          </>
        }
      />

      <FeedbackTable rows={paginatedRows} emptyMessage="No feedback matches these filters." />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
