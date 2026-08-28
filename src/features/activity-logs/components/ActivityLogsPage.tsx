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

export default function ActivityLogsPage() {
  const PAGE_SIZE = usePageSize();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const activityLogsQuery = useActivityLogs({
    page: currentPage,
    limit: PAGE_SIZE,
  });
  const { data } = activityLogsQuery;

  const [deletingLog, setDeletingLog] = useState<ActivityLogRow | null>(null);
  const { mutateAsync: removeLog, isPending: isDeleting } =
    useDeleteActivityLog();
  const { mutateAsync: exportActivityLogs } = useExportActivityLogs();

  const handleExport = () => {
    showToast.promise(exportActivityLogs({}), {
      loading: "Preparing export...",
      success: "Export downloaded.",
      error: "Export failed.",
    });
  };

  const logs = useMemo(() => data?.results ?? [], [data?.results]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleSearchChange = (value: string) => {
    setSearch(value);
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
