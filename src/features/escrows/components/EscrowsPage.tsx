import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { FiDollarSign } from "react-icons/fi";
import { createEscrowColumns } from "./columns";
import { useEscrows, useExportEscrows } from "../queries";
import { usePageSize } from "@/lib/hooks/usePageSize";
import { showToast } from "@/lib/utils/toast";
import type { EscrowRow } from "../types";

const tabs = ["All", "Held", "Frozen", "Refunded", "Released"];

export default function EscrowPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = usePageSize();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const escrowsQuery = useEscrows({
    page: currentPage,
    limit: PAGE_SIZE,
    status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });

  const { data } = escrowsQuery;

  const { mutateAsync: exportEscrows, isPending: isExporting } =
    useExportEscrows();

  const escrows = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleViewDetails = (row: EscrowRow) => {
    navigate(`/escrow/${row.slug}`);
  };

  const handleViewTransaction = (row: EscrowRow) => {
    if (!row.transaction) {
      showToast.error("No transaction attached to this escrow");
      return;
    }
    navigate(`/transactions/${row.transaction.reference}`);
  };

  const handleViewBuyerProfile = (row: EscrowRow) => {
    if (!row.buyer) {
      showToast.error("No buyer on this escrow");
      return;
    }
    navigate(`/users/${row.buyer.id}`);
  };

  const handleViewSellerProfile = (row: EscrowRow) => {
    if (!row.seller) {
      showToast.error("No seller on this escrow");
      return;
    }
    navigate(`/users/${row.seller.id}`);
  };

  // const handleRefund = () => {
  //   showToast.error("Refund isn't wired up yet", {
  //     description: "There's no refund endpoint available for escrows yet.",
  //   });
  // };

  const handleExport = () => {
    showToast.promise(
      exportEscrows({
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

  const columns = createEscrowColumns({
    onViewDetails: handleViewDetails,
    onViewTransaction: handleViewTransaction,
    onViewBuyerProfile: handleViewBuyerProfile,
    onViewSellerProfile: handleViewSellerProfile,
    // onRefund: handleRefund,
  });

  const visibleEscrows = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return escrows;
    return escrows.filter(
      (escrow) =>
        escrow.slug.toLowerCase().includes(q) ||
        (escrow.transaction?.reference.toLowerCase().includes(q) ?? false) ||
        (escrow.buyer?.name.toLowerCase().includes(q) ?? false) ||
        (escrow.seller?.name.toLowerCase().includes(q) ?? false),
    );
  }, [escrows, search]);

  const isFiltering = Boolean(search);

  return (
    <div>
      <PageHeader
        title="Escrow"
        subtitle="Manage every order from offer to escrow to hand-over — with full payment context."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />
      <TableToolbar
        label="Escrow"
        count={isFiltering ? visibleEscrows.length : total}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by escrow ID, transaction ID, buyer, seller..."
        filterSlot={
          <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
        }
      />

      <DataTable
        data={visibleEscrows}
        columns={columns}
        query={escrowsQuery}
        emptyIcon={<FiDollarSign className="w-5 h-5" />}
        emptyMessage="No escrow records match your search."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
