import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TableToolbar from "@/components/generic/TableToolbar";
import Pagination from "@/components/generic/Pagination";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import DateRangeFilter, { type DateRange } from "@/components/generic/DateRangeFilter";
import FeedbackTable from "./FeedbackTable";
import { usePageSize } from "@/lib/hooks/usePageSize";
import { statusLabels, typeLabels } from "../mockData";
import { useFeedbackList } from "../queries";
import type { FeedbackStatus, FeedbackType } from "../types";

const statusOptions = ["All Statuses", ...Object.values(statusLabels)];
const typeOptions = ["All Types", ...Object.values(typeLabels)];

const statusValueByLabel = Object.fromEntries(
  (Object.entries(statusLabels) as [FeedbackStatus, string][]).map(
    ([value, label]) => [label, value],
  ),
) as Record<string, FeedbackStatus>;

const typeValueByLabel = Object.fromEntries(
  (Object.entries(typeLabels) as [FeedbackType, string][]).map(
    ([value, label]) => [label, value],
  ),
) as Record<string, FeedbackType>;

interface NeedsAttentionFilter {
  key: string;
  label: string;
  status?: FeedbackStatus;
  type?: FeedbackType;
}

const needsAttentionFilters: NeedsAttentionFilter[] = [
  {
    key: "unreviewedReportProblem",
    label: "Unreviewed problem reports",
    status: "new",
    type: "report_a_problem",
  },
  {
    key: "lowRatedUnresolvedFeedback",
    label: "Low-rated feedback",
  },
  {
    key: "escalatedToOtherTeam",
    label: "Escalated to other teams",
    status: "escalated",
  },
];

export default function AllFeedbackTab() {
  const PAGE_SIZE = usePageSize();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [activeNaFilter, setActiveNaFilter] = useState(
    () => needsAttentionFilters.find((f) => f.key === searchParams.get("na")) ?? null,
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const clearNaFilter = () => {
    setActiveNaFilter(null);
    const next = new URLSearchParams(searchParams);
    next.delete("na");
    setSearchParams(next, { replace: true });
    setCurrentPage(1);
  };

  const feedbackQuery = useFeedbackList({
    page: currentPage,
    limit: PAGE_SIZE,
    status:
      activeNaFilter?.status ??
      (statusFilter ? statusValueByLabel[statusFilter] : undefined),
    type:
      activeNaFilter?.type ??
      (typeFilter ? typeValueByLabel[typeFilter] : undefined),
    search: debouncedSearch || undefined,
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });

  const { data } = feedbackQuery;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // the list endpoint has no rating filter, so this na filter is applied client-side
  const isLowRatedNaFilter = activeNaFilter?.key === "lowRatedUnresolvedFeedback";
  const rows = isLowRatedNaFilter
    ? (data?.results ?? []).filter((row) => row.isLowRated && row.status !== "resolved")
    : (data?.results ?? []);

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
        count={isLowRatedNaFilter ? rows.length : total}
        searchValue={search}
        onSearchChange={setSearch}
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

      <FeedbackTable
        rows={rows}
        emptyMessage="No feedback matches these filters."
        query={feedbackQuery}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
