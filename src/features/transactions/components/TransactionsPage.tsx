import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateFilterDropdown from "@/components/generic/DateFilterDropdown";
import FiltersButton from "@/components/generic/FiltersButton";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { FiChevronDown } from "react-icons/fi";
import { getYearOptions } from "@/lib/utils/getYearOptions";
import { createTransactionColumns } from "./columns";
import type { TransactionRow } from "../types";
import { showToast } from "@/lib/utils/toast";

const tabs = [
  "All",
  "Awaiting Inspection",
  "Completed",
  "Refunded",
  "Disputed",
];
const yearOptions = getYearOptions();

const transactions: TransactionRow[] = [
  {
    id: "1",
    transactionCode: "TXN-84312",
    buyerName: "Yussuf Ahmed",
    buyerEmail: "debra.holt@example.com",
    sellerName: "Yussuf Ahmed",
    sellerEmail: "debra.holt@example.com",
    amount: "₦364.9M",
    product: "Iphone 14 Pro Max 256GB",
    escrow: "Held",
    inspection: "Awaiting",
    countdown: "21h 14m",
    status: "Active",
    created: "Apr 6, 2026",
  },
  {
    id: "2",
    transactionCode: "TXN-84312",
    buyerName: "Emmanuel Amuneke",
    buyerEmail: "willie.jennings@example.com",
    sellerName: "Emmanuel Amuneke",
    sellerEmail: "willie.jennings@example.com",
    amount: "₦364.9M",
    product: "Iphone 14 Pro Max 256GB",
    escrow: "Held",
    inspection: "Awaiting",
    countdown: "21h 14m",
    status: "Active",
    created: "Apr 6, 2026",
  },
  {
    id: "3",
    transactionCode: "TXN-84312",
    buyerName: "Ebubechukwu Agnes",
    buyerEmail: "bill.sanders@example.com",
    sellerName: "Ebubechukwu Agnes",
    sellerEmail: "bill.sanders@example.com",
    amount: "₦364.9M",
    product: "Iphone 14 Pro Max 256GB",
    escrow: "Held",
    inspection: "Awaiting",
    countdown: "21h 14m",
    status: "Active",
    created: "Mar 6, 2026",
  },
  {
    id: "4",
    transactionCode: "TXN-84312",
    buyerName: "Toluwani Bakare",
    buyerEmail: "michael.mitc@example.com",
    sellerName: "Toluwani Bakare",
    sellerEmail: "michael.mitc@example.com",
    amount: "₦364.9M",
    product: "Iphone 14 Pro Max 256GB",
    escrow: "Held",
    inspection: "Awaiting",
    countdown: "4h 14m",
    status: "Active",
    created: "Feb 6, 2026",
  },
  {
    id: "5",
    transactionCode: "TXN-84312",
    buyerName: "Tolani Bayode",
    buyerEmail: "jackson.graham@example.com",
    sellerName: "Tolani Bayode",
    sellerEmail: "jackson.graham@example.com",
    amount: "₦364.9M",
    product: "Iphone 14 Pro Max 256GB",
    escrow: "Held",
    inspection: "Awaiting",
    countdown: "2h 14m",
    status: "Active",
    created: "Jan 5, 2026",
  },
  {
    id: "6",
    transactionCode: "TXN-84312",
    buyerName: "Solomon Ideh",
    buyerEmail: "georgiayoung@example.com",
    sellerName: "Solomon Ideh",
    sellerEmail: "georgiayoung@example.com",
    amount: "₦364.9M",
    product: "Iphone 14 Pro Max 256GB",
    escrow: "Released",
    inspection: "Completed",
    countdown: "-",
    status: "Completed",
    created: "Feb 6, 2026",
  },
  {
    id: "7",
    transactionCode: "TXN-84312",
    buyerName: "Ogunmodede-Smart",
    buyerEmail: "nathan.roberts@example.com",
    sellerName: "Ogunmodede-Smart",
    sellerEmail: "nathan.roberts@example.com",
    amount: "₦364.9M",
    product: "Iphone 14 Pro Max 256GB",
    escrow: "Released",
    inspection: "Completed",
    countdown: "-",
    status: "Completed",
    created: "Jan 5, 2026",
  },
  {
    id: "8",
    transactionCode: "TXN-84312",
    buyerName: "Hannah Pedro",
    buyerEmail: "sara.cruz@example.com",
    sellerName: "Hannah Pedro",
    sellerEmail: "sara.cruz@example.com",
    amount: "₦364.9M",
    product: "Iphone 14 Pro Max 256GB",
    escrow: "Refunded",
    inspection: "Failed",
    countdown: "-",
    status: "Refunded",
    created: "Jan 5, 2026",
  },
];

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const columns = useMemo(
    () =>
      createTransactionColumns({
        onViewDetails: (txn) => navigate(`/transactions/${txn.id}`),
        onViewItem: (txn) => console.log("view item", txn.id),
        onViewBuyerProfile: (txn) => navigate(`/users/buyer-${txn.id}`),
        onViewSellerProfile: (txn) => navigate(`/users/seller-${txn.id}`),
        onContactBuyer: () => console.log("contact buyer"),
        onContactSeller: () => console.log("contact seller"),
        onDownloadReceipt: () =>
          showToast.success("Reminder Sent successfully!", {
            description:
              "A reminder has been sent to the user to make payment.",
          }),

        onRefund: () =>
          showToast.error("Refund failed", {
            description: "Something went wrong processing the refund.",
          }),
      }),
    [],
  );

  const tabStatusMap: Record<
    string,
    TransactionRow["status"] | "AwaitingInspection"
  > = {
    "Awaiting Inspection": "Active",
    Completed: "Completed",
    Refunded: "Refunded",
    Disputed: "Disputed",
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesTab =
      activeTab === "All" || txn.status === tabStatusMap[activeTab];
    const matchesSearch =
      txn.transactionCode.toLowerCase().includes(search.toLowerCase()) ||
      txn.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      txn.sellerName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Manage every order from offer to escrow to hand-over — with full payment context."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            rightIcon={
              <FiChevronDown className="w-4 h-4 text-brand-gray-dark" />
            }
            onClick={() => {
              /* export logic */
            }}
          >
            Export
          </Button>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="overflow-hidden">
        <TableToolbar
          label="Users"
          count={filteredTransactions.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by transaction ID, buyer, seller..."
          filterSlot={
            <>
              <DateFilterDropdown
                value={year}
                options={yearOptions}
                onChange={setYear}
              />
              <FiltersButton>
                <p className="text-xs text-brand-gray-light">
                  No filters configured yet.
                </p>
              </FiltersButton>
            </>
          }
        />
        <div className="overflow-x-auto">
          <DataTable data={filteredTransactions} columns={columns} />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
