import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
// import FiltersButton from "@/components/generic/FiltersButton";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
// import Button from "@/components/generic/Button";
// import { PiExportFill } from "react-icons/pi";
// import { FiChevronDown } from "react-icons/fi";
import { createTransactionColumns } from "./columns";
import { useTransactions } from "../queries";
import { usePageSize } from "@/lib/hooks/usePageSize";

const tabs = ["All", "Active", "Completed", "Disputed", "Stalled"];

export default function TransactionsPage() {
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

  const columns = useMemo(() => createTransactionColumns(), []);

  // no search or date params on the endpoint — filtering the current page
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
        // TODO: no transactions export endpoint yet
        // actions={
        //   <Button
        //     leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
        //     rightIcon={
        //       <FiChevronDown className="w-4 h-4 text-brand-gray-dark" />
        //     }
        //     onClick={() => {}}
        //   >
        //     Export
        //   </Button>
        // }
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
    </div>
  );
}
