import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { createActivityLogColumns } from "./columns";
import ConfirmModal from "@/components/generic/ConfirmModal";
import {
  useActivityLogs,
  useDeleteActivityLog,
  useExportActivityLogs,
} from "../queries";
import { formatActor } from "../utils";
import { showToast } from "@/lib/utils/toast";
import type { ActivityLogRow } from "../types";
import { usePageSize } from "@/lib/hooks/usePageSize";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";

const ENTITY_TYPES = [
  { label: "All Types", value: "" },
  { label: "Transaction", value: "transaction" },
  { label: "Listing", value: "listing" },
  { label: "Review", value: "review" },
  { label: "Report", value: "report" },
  { label: "Content", value: "content" },
  { label: "Campaign", value: "campaign" },
];

export default function ActivityLogsPage() {
  const PAGE_SIZE = usePageSize();

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [entityType, setEntityType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const activityLogsQuery = useActivityLogs({
    page: currentPage,
    limit: PAGE_SIZE,
    entityType: entityType || undefined,
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });

  const { data } = activityLogsQuery;

  const [deletingLog, setDeletingLog] = useState<ActivityLogRow | null>(null);
  const { mutateAsync: removeLog, isPending: isDeleting } =
    useDeleteActivityLog();
  const { mutateAsync: exportActivityLogs } = useExportActivityLogs();

  const handleExport = () => {
    showToast.promise(
      exportActivityLogs({
        entityType: entityType || undefined,
        startDate: dateRange.from || undefined,
        endDate: dateRange.to || undefined,
      }),
      {
        loading: "Preparing export...",
        success: "Export downloaded.",
        error: "Export failed.",
      },
    );
  };

  const logs = useMemo(() => data?.results ?? [], [data?.results]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleEntityTypeChange = (label: string) => {
    setEntityType(ENTITY_TYPES.find((t) => t.label === label)?.value ?? "");
    setCurrentPage(1);
  };

  const columns = useMemo(
    () =>
      createActivityLogColumns({
        onViewDetails: (log) => navigate(`/activity-logs/${log._id}`),
        onRemove: (log) => setDeletingLog(log),
      }),
    [navigate],
  );

  const handleConfirmDelete = () => {
    if (!deletingLog) return;

    showToast.promise(
      removeLog(deletingLog._id).then(() => setDeletingLog(null)),
      {
        loading: "Removing log entry...",
        success: "Log entry removed.",
        error: "Couldn't remove log entry.",
      },
    );
  };

  const visibleLogs = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return logs;
    return logs.filter(
      (log) =>
        log.event.toLowerCase().includes(query) ||
        log.entityType.toLowerCase().includes(query) ||
        formatActor(log.actor).toLowerCase().includes(query) ||
        (log.slug?.toLowerCase().includes(query) ?? false) ||
        (log.ipAddress?.toLowerCase().includes(query) ?? false),
    );
  }, [logs, search]);
  return (
    <div>
      <PageHeader
        title="Activity"
        subtitle="Full audit trail of admin and system actions."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            onClick={handleExport}
          >
            Export
          </Button>
        }
      />

      <TableToolbar
        label="Activity Logs"
        count={search ? visibleLogs.length : total}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search activity logs..."
        filterSlot={
          <>
            <DateRangeFilter
              value={dateRange}
              onChange={handleDateRangeChange}
            />
            <FiltersButton activeCount={entityType ? 1 : 0}>
              <CustomSelect
                label="Entity Type"
                value={
                  ENTITY_TYPES.find((t) => t.value === entityType)?.label ??
                  "All Types"
                }
                options={ENTITY_TYPES.map((t) => t.label)}
                onChange={handleEntityTypeChange}
              />
            </FiltersButton>
          </>
        }
      />

      <DataTable
        data={visibleLogs}
        columns={columns}
        query={activityLogsQuery}
        emptyMessage="No activity logs found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {deletingLog && (
        <ConfirmModal
          title="Remove log entry"
          message={`Remove ${deletingLog.slug ?? "this log entry"}? Audit history can't be recovered once deleted.`}
          confirmLabel="Remove"
          isSubmitting={isDeleting}
          onClose={() => setDeletingLog(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
