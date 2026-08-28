/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
// import { FiEye } from "react-icons/fi";
// import { HiOutlineReceiptRefund, HiOutlineUser } from "react-icons/hi2";
// import { IoMailOutline } from "react-icons/io5";
// import RowActionsMenu, {
//   type RowAction,
// } from "@/components/generic/RowActionsMenu";
// import { TbReceipt } from "react-icons/tb";
// import { BiPackage } from "react-icons/bi";
import type { EscrowRow } from "../types";
import PartyCell from "./PartyCell";

// TODO: re-enable once the escrow action endpoints exist
// interface EscrowColumnCallbacks {
//   onViewTransaction: (escrow: EscrowRow) => void;
//   onViewBuyerProfile: (escrow: EscrowRow) => void;
//   onViewSellerProfile: (escrow: EscrowRow) => void;
//   onContactBuyer: (escrow: EscrowRow) => void;
//   onContactSeller: (escrow: EscrowRow) => void;
//   onRefund: (escrow: EscrowRow) => void;
//   onDownloadReceipt: (escrow: EscrowRow) => void;
//   onViewItem: (escrow: EscrowRow) => void;
// }

const statusPillClass: Record<string, string> = {
  held: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  frozen: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  refunded: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
  released: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatAmount(value: number | null) {
  return value === null || value === undefined ? "—" : currency.format(value);
}

export function createEscrowColumns(): ColumnDef<EscrowRow, any>[] {
  // TODO: re-enable with the action endpoints
  // function getRowActions(row: EscrowRow): RowAction[] {
  //   const base: RowAction[] = [
  //     {
  //       label: "View Transaction",
  //       icon: <FiEye className="w-4 h-4" />,
  //       onClick: () => callbacks.onViewTransaction(row),
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
  //   if (row.status !== "refunded" && row.status !== "released") {
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
      accessorKey: "slug",
      header: "Escrow ID",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-brand-gray-dark dark:text-gray-200">
          {row.original.slug}
        </span>
      ),
    },
    {
      accessorKey: "transaction",
      header: "Transaction ID",
      cell: ({ row }) =>
        row.original.transaction ? (
          <span className="text-brand-blue whitespace-nowrap">
            {row.original.transaction.reference}
          </span>
        ) : (
          <span className="text-brand-gray-light">—</span>
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
      accessorKey: "amountHeld",
      header: "Amount Held",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatAmount(row.original.amountHeld)}
        </span>
      ),
    },
    {
      accessorKey: "platformFee",
      header: "Platform Fee",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatAmount(row.original.platformFee)}
        </span>
      ),
    },
    {
      accessorKey: "sellerPayoutAmount",
      header: "Seller Receivable",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatAmount(row.original.sellerPayoutAmount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            statusPillClass[row.original.status] ?? statusFallback
          }`}
        >
          {formatLabel(row.original.status)}
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
