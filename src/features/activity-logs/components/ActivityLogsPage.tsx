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
import type { ActivityLogRow } from "../types";

const activityLogs: ActivityLogRow[] = [
  { id: "1", actorName: "Hannah Pedro", action: "Resolved dispute", target: "DSP-012", ipAddress: "1023.30.177.150", timestamp: "Apr 6, 2026" },
  { id: "2", actorName: "Ebubechukwu Agnes", action: "Escalated dispute", target: "DSP-007", ipAddress: "1023.30.177.150", timestamp: "Apr 6, 2026" },
  { id: "3", actorName: "Emmanuel Amuneke", action: "Created a new listing", target: "Bookshelf Unit", targetLink: "#", ipAddress: "1023.30.177.150", timestamp: "Mar 6, 2026" },
  { id: "4", actorName: "Adese Samson", action: "Escalated dispute", target: "DSP-020", ipAddress: "1023.30.177.150", timestamp: "Feb 6, 2026" },
  { id: "5", actorName: "Oyebamiji Oluwasola", action: "Flagged listing for review", target: "Frozen Chicken Pack", targetLink: "#", ipAddress: "1023.30.177.150", timestamp: "Jan 5, 2026" },
  { id: "6", actorName: "Yussuf Ahmed", action: "Refunded a transaction", target: "-", ipAddress: "1023.30.177.150", timestamp: "Feb 6, 2026" },
  { id: "7", actorName: "Jicholia Oyebola", action: "Created a new listing", target: "L-Shaped Sofa", targetLink: "#", ipAddress: "1023.30.177.150", timestamp: "Jan 5, 2026" },
  { id: "8", actorName: "Solomon Ideh", action: "Resolved dispute", target: "DSP-016", ipAddress: "1023.30.177.150", timestamp: "Feb 6, 2026" },
];

export default function ActivityLogsPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      createActivityLogColumns({
        onViewDetails: (log) => navigate(`/activity-logs/${log.id}`),
        onRemove: (log) => console.log("remove", log.id), // TODO: wire remove flow / confirm modal
      }),
    [],
  );

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Activity"
        subtitle="Full audit trail of admin and system actions."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            rightIcon={<FiChevronDown className="w-4 h-4 text-brand-gray-dark" />}
            onClick={() => {
              /* export logic */
            }}
          >
            Export
          </Button>
        }
      />

      <div className="overflow-hidden">
        <TableToolbar
          label="Activity Logs"
          count={filteredLogs.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search activity logs..."
        />

        <DataTable data={filteredLogs} columns={columns} />

        <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}