import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { FiChevronDown } from "react-icons/fi";
import { createActivityLogColumns } from "./columns";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import { useActivityLogs } from "../queries";

export default function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const { data, isLoading } = useActivityLogs({
    page: currentPage,
    limit: PAGE_SIZE,
  });
  
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
      onRemove: (log) => console.log("remove", log._id), // TODO: no delete endpoint yet
    }),
  [navigate],
);

  const visibleLogs = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return logs;
    return logs.filter(
      (log) =>
        log.event.toLowerCase().includes(query) ||
        log.entityType.toLowerCase().includes(query) ||
        log.actor.toLowerCase().includes(query) ||
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
            rightIcon={
              <FiChevronDown className="w-4 h-4 text-brand-gray-dark" />
            }
            onClick={() => {
              /* TODO: no activity-log export endpoint yet */
            }}
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

      <DataTable data={visibleLogs} columns={columns} isLoading={isLoading} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}