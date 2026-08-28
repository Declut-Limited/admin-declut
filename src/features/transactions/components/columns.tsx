/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
// import { FiEye } from "react-icons/fi";
// import { HiOutlineReceiptRefund, HiOutlineUser } from "react-icons/hi2";
// import RowActionsMenu, {
//   type RowAction,
// } from "@/components/generic/RowActionsMenu";
// import { TbReceipt } from "react-icons/tb";
// import { BiPackage } from "react-icons/bi";
// import { IoMailOutline } from "react-icons/io5";
import type { TransactionRow } from "../types";
import PartyCell from "./PartyCell";

// TODO: re-enable once the transaction action endpoints exist
// interface TransactionColumnCallbacks {
//   onViewDetails: (txn: TransactionRow) => void;
//   onDownloadReceipt: (txn: TransactionRow) => void;
//   onViewItem: (txn: TransactionRow) => void;
//   onViewBuyerProfile: (txn: TransactionRow) => void;
//   onViewSellerProfile: (txn: TransactionRow) => void;
//   onContactBuyer: (txn: TransactionRow) => void;
//   onContactSeller: (txn: TransactionRow) => void;
//   onRefund: (txn: TransactionRow) => void;
// }

const escrowClass: Record<string, string> = {
  held: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  released: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  refunded: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
};

const inspectionClass: Record<string, string> = {
  awaiting: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  completed:
    "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  failed: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
};

const statusPillClass: Record<string, string> = {
  pending_payment:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  escrow_active:
    "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  awaiting_inspection:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  completed: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  refunded: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
  disputed: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
  stalled: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  cancelled:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCountdown(deadline: string | null) {
  if (!deadline) return null;
  const target = new Date(deadline).getTime();
  if (Number.isNaN(target)) return null;

  const diffMs = target - Date.now();
  if (diffMs <= 0) return { label: "Expired", hours: 0 };

  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    return { label: `${days}d ${hours % 24}h`, hours };
  }
  return { label: `${hours}h ${minutes}m`, hours };
}

export function createTransactionColumns(): ColumnDef<TransactionRow, any>[] {
  // TODO: re-enable with the action endpoints
  // function getRowActions(row: TransactionRow): RowAction[] {
  //   const base: RowAction[] = [
  //     {
  //       label: "View Details",
  //       icon: <FiEye className="w-4 h-4" />,
  //       onClick: () => callbacks.onViewDetails(row),
  //     },
  //     {
  //       label: "Download Receipt",
  //       icon: <TbReceipt className="w-4 h-4" />,
  //       onClick: () => callbacks.onDownloadReceipt(row),
  //     },
  //     {
  //       label: "View Item",
  //       icon: <BiPackage className="w-4 h-4" />,
  //       onClick: () => callbacks.onViewItem(row),
  //     },
  //     {
  //       label: "View Buyer Profile",
  //       icon: <HiOutlineUser className="w-4 h-4" />,
  //       onClick: () => callbacks.onViewBuyerProfile(row),
  //       dividerAfter: true,
  //     },
  //     {
  //       label: "View Seller Profile",
  //       icon: <HiOutlineUser className="w-4 h-4" />,
  //       onClick: () => callbacks.onViewSellerProfile(row),
  //     },
  //     {
  //       label: "Contact Buyer",
  //       icon: <IoMailOutline className="w-4 h-4" />,
  //       onClick: () => callbacks.onContactBuyer(row),
  //       dividerAfter: true,
  //     },
  //     {
  //       label: "Contact Seller",
  //       icon: <IoMailOutline className="w-4 h-4" />,
  //       onClick: () => callbacks.onContactSeller(row),
  //     },
  //   ];
  //
  //   if (row.status !== "refunded" && row.status !== "completed") {
  //     base.push({
  //       label: "Refund",
  //       icon: <HiOutlineReceiptRefund className="w-4 h-4" />,
  //       variant: "danger",
  //       onClick: () => callbacks.onRefund(row),
  //     });
  //   }
  //
  //   return base;
  // }

  return [
    {
      id: "select",
      header: () => (
        <input type="checkbox" className="rounded border-gray-300" />
      ),
      cell: () => <input type="checkbox" className="rounded border-gray-300" />,
    },
    {
      accessorKey: "reference",
      header: "Transaction",
      cell: ({ row }) => (
        <span className="text-brand-blue font-medium whitespace-nowrap">
          {row.original.reference}
        </span>
      ),
    },
    {
      accessorKey: "buyer",
      header: "Buyer",
      cell: ({ row }) =>
        row.original.buyer ? (
          <PartyCell
            name={row.original.buyer.name}
            email={row.original.buyer.email}
          />
        ) : (
          <span className="text-brand-gray-light">—</span>
        ),
    },
    {
      accessorKey: "seller",
      header: "Seller",
      cell: ({ row }) =>
        row.original.seller ? (
          <PartyCell
            name={row.original.seller.name}
            email={row.original.seller.email}
          />
        ) : (
          <span className="text-brand-gray-light">—</span>
        ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {currency.format(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: "listing",
      header: "Product",
      cell: ({ row }) => (
        <span
          title={row.original.listing?.title}
          className="whitespace-nowrap max-w-48 truncate block"
        >
          {row.original.listing?.title ?? "—"}
        </span>
      ),
    },
    {
      accessorKey: "escrow",
      header: "Escrow",
      cell: ({ row }) =>
        row.original.escrow ? (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              escrowClass[row.original.escrow.status] ?? statusFallback
            }`}
          >
            {formatLabel(row.original.escrow.status)}
          </span>
        ) : (
          <span className="text-brand-gray-light">—</span>
        ),
    },
    {
      accessorKey: "inspectionStatus",
      header: "Inspection",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            inspectionClass[row.original.inspectionStatus] ?? statusFallback
          }`}
        >
          {formatLabel(row.original.inspectionStatus)}
        </span>
      ),
    },
    {
      accessorKey: "inspectionDeadlineAt",
      header: "Countdown",
      cell: ({ row }) => {
        const countdown = formatCountdown(row.original.inspectionDeadlineAt);
        if (!countdown) return <span className="text-brand-gray-light">-</span>;
        return (
          <span
            className={
              countdown.hours < 5
                ? "text-[#F04438] dark:text-red-400"
                : "text-[#F79009] dark:text-amber-400"
            }
          >
            {countdown.label}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            statusPillClass[row.original.status] ?? statusFallback
          }`}
        >
          {formatLabel(row.original.status)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatDate(row.original.createdAt)}
        </span>
      ),
    },
    // TODO: re-enable with the action endpoints
    // {
    //   id: "actions",
    //   header: "Action",
    //   cell: ({ row }) => (
    //     <RowActionsMenu actions={getRowActions(row.original)} />
    //   ),
    // },
  ];
}
