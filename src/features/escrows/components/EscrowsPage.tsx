import { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import FiltersButton from "@/components/generic/FiltersButton";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
// import Button from "@/components/generic/Button";
// import { PiExportFill } from "react-icons/pi";
import { FiDollarSign } from "react-icons/fi";
import { createEscrowColumns } from "./columns";
import { useEscrows } from "../queries";
import { usePageSize } from "@/lib/hooks/usePageSize";

const tabs = ["All", "Held", "Frozen", "Refunded", "Released"];

export default function EscrowPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = usePageSize();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const escrowsQuery = useEscrows({
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const { data } = escrowsQuery;

  const escrows = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns = useMemo(() => createEscrowColumns(), []);

  const visibleEscrows = useMemo(() => {
    return escrows.filter((escrow) => {
      const matchesTab =
        activeTab === "All" || escrow.status === activeTab.toLowerCase();

      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        escrow.slug.toLowerCase().includes(q) ||
        (escrow.transaction?.reference.toLowerCase().includes(q) ?? false) ||
        (escrow.buyer?.name.toLowerCase().includes(q) ?? false) ||
        (escrow.seller?.name.toLowerCase().includes(q) ?? false);

      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const created = new Date(escrow.createdAt).getTime();
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

      return matchesTab && matchesSearch && matchesDate;
    });
  }, [escrows, activeTab, search, dateRange]);

  const isFiltering =
    activeTab !== "All" || Boolean(search || dateRange.from || dateRange.to);

  return (
    <div>
      <PageHeader
        title="Escrow"
        subtitle="Manage every order from offer to escrow to hand-over — with full payment context."
        // TODO: no escrows export endpoint yet
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
        label="Escrow"
        count={isFiltering ? visibleEscrows.length : total}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by escrow ID, transaction ID, buyer, seller..."
        filterSlot={
          <>
            <DateRangeFilter value={dateRange} onChange={setDateRange} />
            <FiltersButton>
              <p className="text-xs text-brand-gray-light">
                No filters configured yet.
              </p>
            </FiltersButton>
          </>
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
