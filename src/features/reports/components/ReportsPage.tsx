import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
// import FiltersButton from "@/components/generic/FiltersButton";
// import CustomSelect from "@/components/generic/CustomSelect";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
// import { FiChevronDown } from "react-icons/fi";
import { createReportColumns } from "./columns";
import { showToast } from "@/lib/utils/toast";
import {
  useReports,
  useExportReports,
  useUpdateReportStatus,
} from "../queries";
import type { ReportStatus } from "../types";
import { usePageSize } from "@/lib/hooks/usePageSize";

const tabs = ["All", "Investigating", "Resolved", "Dismissed", "Disputed"];

export default function ReportsPage() {
  const PAGE_SIZE = usePageSize();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const reportsQuery = useReports({
    page: currentPage,
    limit: PAGE_SIZE,
    status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });
  const navigate = useNavigate();

  const { data } = reportsQuery;

  const { mutateAsync: updateStatus } = useUpdateReportStatus();
  const { mutateAsync: exportReports } = useExportReports();

  const handleExport = () => {
    showToast.promise(
      exportReports({
        status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
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

  const reports = useMemo(() => data?.results ?? [], [data?.results]);

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

    return createReportColumns({
      onViewDetails: (report) => navigate(`/reports/${report.slug}`),
      onInvestigate: (report) =>
        changeStatus(report._id, report.slug, "investigating", "Investigating"),
      onDismiss: (report) =>
        changeStatus(report._id, report.slug, "dismissed", "Dismissing"),
      onResolve: (report) =>
        changeStatus(report._id, report.slug, "resolved", "Resolving"),
    });
  }, [navigate, updateStatus]);
  const visibleReports = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return reports;
    return reports.filter(
      (report) =>
        report.slug.toLowerCase().includes(query) ||
        (report.title?.toLowerCase().includes(query) ?? false) ||
        report.reason.toLowerCase().includes(query) ||
        (report.reporter?.name.toLowerCase().includes(query) ?? false) ||
        (report.listing?.title.toLowerCase().includes(query) ?? false),
    );
  }, [reports, search]);

  return (
    <div>
      <PageHeader
        title="Reports"
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
        label="Reports"
        count={search ? visibleReports.length : total}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search reports..."
        filterSlot={
          <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
        }
      />

      <DataTable
        data={visibleReports}
        columns={columns}
        query={reportsQuery}
        emptyMessage="No reports found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
