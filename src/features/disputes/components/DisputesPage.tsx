import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
// import { FiChevronDown } from "react-icons/fi";
import { createDisputeColumns } from "./columns";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import { showToast } from "@/lib/utils/toast";
import {
  useDisputes,
  useExportDisputes,
  useUpdateReportStatus,
} from "../queries";
import type { ReportStatus } from "../types";

const tabs = ["All", "New", "Investigating", "Resolved", "Dismissed"];

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

const disputesQuery = useDisputes({ page: currentPage, limit: PAGE_SIZE });
const { data } = disputesQuery;

  const { mutateAsync: updateStatus } = useUpdateReportStatus();
  const { mutateAsync: exportDisputes } = useExportDisputes();

  const handleExport = () => {
    showToast.promise(exportDisputes({}), {
      loading: "Preparing export...",
      success: "Export downloaded.",
      error: "Export failed.",
    });
  };
  const disputes = useMemo(() => data?.results ?? [], [data?.results]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val === "All Statuses" ? "" : val);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const columns = useMemo(() => {
    const changeStatus = (
      reportId: string,
      slug: string,
      status: ReportStatus,
      verb: string,
    ) => {
      showToast.promise(updateStatus({ reportId, payload: { status } }), {
        loading: `${verb} ${slug}...`,
        success: `${slug} is now ${status}.`,
        error: `Couldn't update ${slug}.`,
      });
    };

    return createDisputeColumns({
      onViewDetails: (dispute) => navigate(`/disputes/${dispute.slug}`),
      onInvestigate: (dispute) =>
        changeStatus(
          dispute._id,
          dispute.slug,
          "investigating",
          "Investigating",
        ),
      onDismiss: (dispute) =>
        changeStatus(dispute._id, dispute.slug, "dismissed", "Dismissing"),
      onResolve: (dispute) =>
        changeStatus(dispute._id, dispute.slug, "resolved", "Resolving"),
    });
  }, [navigate, updateStatus]);

  const visibleDisputes = useMemo(() => {
    return disputes.filter((dispute) => {
      const matchesTab =
        activeTab === "All" || dispute.status === activeTab.toLowerCase();

      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        dispute.slug.toLowerCase().includes(query) ||
        dispute.title.toLowerCase().includes(query) ||
        dispute.reason.toLowerCase().includes(query) ||
        (dispute.user?.name.toLowerCase().includes(query) ?? false) ||
        (dispute.listing?.title.toLowerCase().includes(query) ?? false);

      const matchesStatus =
        !statusFilter || dispute.status === statusFilter.toLowerCase();

      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const created = new Date(dispute.createdAt).getTime();
        if (Number.isNaN(created)) matchesDate = false;
        else {
          if (
            dateRange.from &&
            created < new Date(dateRange.from).setHours(0, 0, 0, 0)
          )
            matchesDate = false;
          if (
            dateRange.to &&
            created > new Date(dateRange.to).setHours(23, 59, 59, 999)
          )
            matchesDate = false;
        }
      }

      return matchesTab && matchesSearch && matchesStatus && matchesDate;
    });
  }, [disputes, activeTab, search, statusFilter, dateRange]);

  const isFiltering =
    activeTab !== "All" ||
    Boolean(search) ||
    Boolean(statusFilter) ||
    Boolean(dateRange.from || dateRange.to);

  return (
    <div>
      <PageHeader
        title="Disputes"
        subtitle="Handle listings and users flagged by the community."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            // rightIcon={<FiChevronDown className="w-4 h-4 text-brand-gray-dark" />}
            onClick={handleExport}
          >
            Export
          </Button>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <TableToolbar
        label="Disputes"
        count={isFiltering ? visibleDisputes.length : total}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search disputes..."
        filterSlot={
          <>
            <DateRangeFilter
              value={dateRange}
              onChange={handleDateRangeChange}
            />
            <FiltersButton activeCount={statusFilter ? 1 : 0}>
              <CustomSelect
                label="Status"
                value={statusFilter || "All Statuses"}
                options={[
                  "All Statuses",
                  "New",
                  "Investigating",
                  "Dismissed",
                  "Resolved",
                ]}
                onChange={handleStatusFilterChange}
              />
            </FiltersButton>
          </>
        }
      />

      <DataTable
        data={visibleDisputes}
        columns={columns}
       query={disputesQuery}
        emptyMessage="No disputes found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
