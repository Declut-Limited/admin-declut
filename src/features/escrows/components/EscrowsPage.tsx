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
import { FiChevronDown, FiDollarSign } from "react-icons/fi";
import { getYearOptions } from "@/lib/utils/getYearOptions";
import { createEscrowColumns } from "./columns";
import type { EscrowRow } from "../types";
import { showToast } from "@/lib/utils/toast";

const tabs = ["All", "Held", "Frozen", "Refunds", "Released"];
const yearOptions = getYearOptions();

const escrows: EscrowRow[] = [
  {
    id: "1",
    escrowId: "ESC-84312",
    transactionId: "TXN-84312",
    buyerName: "Yussuf Ahmed",
    buyerEmail: "debra.holt@example.com",
    sellerName: "Yussuf Ahmed",
    sellerEmail: "debra.holt@example.com",
    product: "Iphone 14 Pro Max 256GB",
    amountHeld: "₦364.9M",
    platformFee: "₦364.9M",
    sellerReceivable: "₦364.9M",
    status: "Held",
  },
  {
    id: "2",
    escrowId: "ESC-84312",
    transactionId: "TXN-84312",
    buyerName: "Emmanuel Amuneke",
    buyerEmail: "willie.jennings@example.com",
    sellerName: "Emmanuel Amuneke",
    sellerEmail: "willie.jennings@example.com",
    product: "Iphone 14 Pro Max 256GB",
    amountHeld: "₦364.9M",
    platformFee: "₦364.9M",
    sellerReceivable: "₦364.9M",
    status: "Held",
  },
  {
    id: "3",
    escrowId: "ESC-84312",
    transactionId: "TXN-84312",
    buyerName: "Ebubechukwu Agnes",
    buyerEmail: "bill.sanders@example.com",
    sellerName: "Ebubechukwu Agnes",
    sellerEmail: "bill.sanders@example.com",
    product: "Iphone 14 Pro Max 256GB",
    amountHeld: "₦364.9M",
    platformFee: "₦364.9M",
    sellerReceivable: "₦364.9M",
    status: "Held",
  },
  {
    id: "4",
    escrowId: "ESC-84312",
    transactionId: "TXN-84312",
    buyerName: "Toluwani Bakare",
    buyerEmail: "michael.mitc@example.com",
    sellerName: "Toluwani Bakare",
    sellerEmail: "michael.mitc@example.com",
    product: "Iphone 14 Pro Max 256GB",
    amountHeld: "₦364.9M",
    platformFee: "₦364.9M",
    sellerReceivable: "₦364.9M",
    status: "Held",
  },
  {
    id: "5",
    escrowId: "ESC-84312",
    transactionId: "TXN-84312",
    buyerName: "Tolani Bayode",
    buyerEmail: "jackson.graham@example.com",
    sellerName: "Tolani Bayode",
    sellerEmail: "jackson.graham@example.com",
    product: "Iphone 14 Pro Max 256GB",
    amountHeld: "₦364.9M",
    platformFee: "₦364.9M",
    sellerReceivable: "₦364.9M",
    status: "Held",
  },
  {
    id: "6",
    escrowId: "ESC-84312",
    transactionId: "TXN-84312",
    buyerName: "Solomon Ideh",
    buyerEmail: "georgiayoung@example.com",
    sellerName: "Solomon Ideh",
    sellerEmail: "georgiayoung@example.com",
    product: "Iphone 14 Pro Max 256GB",
    amountHeld: "₦364.9M",
    platformFee: "₦364.9M",
    sellerReceivable: "₦364.9M",
    status: "Held",
  },
  {
    id: "7",
    escrowId: "ESC-84312",
    transactionId: "TXN-84312",
    buyerName: "Ogunmodede-Smart",
    buyerEmail: "nathan.roberts@example.com",
    sellerName: "Ogunmodede-Smart",
    sellerEmail: "nathan.roberts@example.com",
    product: "Iphone 14 Pro Max 256GB",
    amountHeld: "₦364.9M",
    platformFee: "₦364.9M",
    sellerReceivable: "₦364.9M",
    status: "Held",
  },
];

export default function EscrowPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      createEscrowColumns({
        onViewTransaction: (escrow) => navigate(`/escrow/${escrow.id}`),
        onViewItem: (escrow) => console.log("view item", escrow.id),
        onViewBuyerProfile: (escrow) => navigate(`/users/buyer-${escrow.id}`),
        onViewSellerProfile: (escrow) => navigate(`/users/seller-${escrow.id}`),
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

  const tabStatusMap: Record<string, EscrowRow["status"]> = {
    Held: "Held",
    Frozen: "Frozen",
    Refunds: "Refunded",
    Released: "Released",
  };

  const filteredEscrows = escrows.filter((escrow) => {
    const matchesTab =
      activeTab === "All" || escrow.status === tabStatusMap[activeTab];
    const matchesSearch =
      escrow.escrowId.toLowerCase().includes(search.toLowerCase()) ||
      escrow.transactionId.toLowerCase().includes(search.toLowerCase()) ||
      escrow.buyerName.toLowerCase().includes(search.toLowerCase()) ||
      escrow.sellerName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Escrow"
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
          label="Escrow"
          count={filteredEscrows.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by escrow ID, transaction ID, buyer, seller..."
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
          <DataTable
            data={filteredEscrows}
            columns={columns}
            //TODO:add in other tables  
            emptyIcon={<FiDollarSign className="w-5 h-5" />}
            emptyMessage="No escrow records match your search."
          />
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
