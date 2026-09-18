import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
// import FiltersButton from "@/components/generic/FiltersButton";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { createTransactionColumns } from "./columns";
import ReceiptModal from "./ReceiptModal";
import { buildReceiptFromRecord } from "../receipt";
import {
  useTransactions,
  useTransactionLookup,
  useExportTransactions,
} from "../queries";
import { usePageSize } from "@/lib/hooks/usePageSize";
import { showToast } from "@/lib/utils/toast";
import type { TransactionRow } from "../types";

const tabs = ["All", "Active", "Completed", "Refunded", "Disputed"];

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = usePageSize();
  const {
    mutate: lookupTransaction,
    data: receiptResponse,
    reset: resetReceiptLookup,
  } = useTransactionLookup();
  const { mutateAsync: exportTransactions } = useExportTransactions();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const transactionsQuery = useTransactions({
    page: currentPage,
    limit: PAGE_SIZE,
    tab: activeTab === "All" ? undefined : activeTab.toLowerCase(),
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });

  const { data } = transactionsQuery;

  const transactions = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleViewDetails = (row: TransactionRow) => {
    navigate(`/transactions/${row.reference}`);
  };

  const handleDownloadReceipt = (row: TransactionRow) => {
    lookupTransaction(row._id, {
      onError: () =>
        showToast.error("Couldn't load receipt", {
          description: "Please try again in a moment.",
        }),
    });
  };

  const handleViewItem = (row: TransactionRow) => {
    if (!row.listing) {
      showToast.error("No listing attached to this transaction");
      return;
    }
    navigate(`/listings/${row.listing.slug}`);
  };

  const handleViewBuyerProfile = (row: TransactionRow) => {
    if (!row.buyer) {
      showToast.error("No buyer on this transaction");
      return;
    }
    navigate(`/users/${row.buyer.id}`);
  };

  const handleViewSellerProfile = (row: TransactionRow) => {
    if (!row.seller) {
      showToast.error("No seller on this transaction");
      return;
    }
    navigate(`/users/${row.seller.id}`);
  };

  const handleRefund = () => {
    showToast.error("Refund isn't wired up yet", {
      description: "There's no refund endpoint available for transactions yet.",
    });
  };

  const handleExport = () => {
    showToast.promise(
      exportTransactions({
        tab: activeTab === "All" ? undefined : activeTab.toLowerCase(),
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

  const columns = createTransactionColumns(
    {
      onViewDetails: handleViewDetails,
      onDownloadReceipt: handleDownloadReceipt,
      onViewItem: handleViewItem,
      onViewBuyerProfile: handleViewBuyerProfile,
      onViewSellerProfile: handleViewSellerProfile,
      onRefund: handleRefund,
    },
    { showDisputeStatus: activeTab === "Disputed" },
  );

  const visibleTransactions = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return transactions;
    return transactions.filter(
      (txn) =>
        txn.reference.toLowerCase().includes(q) ||
        (txn.buyer?.name.toLowerCase().includes(q) ?? false) ||
        (txn.seller?.name.toLowerCase().includes(q) ?? false) ||
        (txn.listing?.title.toLowerCase().includes(q) ?? false),
    );
  }, [transactions, search]);

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Manage every order from offer to escrow to hand-over — with full payment context."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            onClick={handleExport}
          >
            Export
          </Button>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <TableToolbar
        label="Transactions"
        count={search ? visibleTransactions.length : total}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by transaction ID, buyer, seller..."
        filterSlot={
          <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
        }
      />

      <DataTable
        data={visibleTransactions}
        columns={columns}
        query={transactionsQuery}
        emptyMessage="No transactions found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {receiptResponse && (
        <ReceiptModal
          receipt={buildReceiptFromRecord(receiptResponse.data)}
          onClose={resetReceiptLookup}
        />
      )}
    </div>
  );
}
