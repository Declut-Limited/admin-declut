/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
// import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { HiOutlineUser } from "react-icons/hi2";
import { IoMailOutline } from "react-icons/io5";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { EscrowRow } from "../types";
import PartyCell from "./PartyCell";
import { statusPillClass, statusFallback, formatLabel, formatAmount } from "../statusStyles";

export interface EscrowColumnCallbacks {
  onViewDetails: (escrow: EscrowRow) => void;
  onViewTransaction: (escrow: EscrowRow) => void;
  onViewBuyerProfile: (escrow: EscrowRow) => void;
  onViewSellerProfile: (escrow: EscrowRow) => void;
  // onRefund: (escrow: EscrowRow) => void;
}

export function createEscrowColumns(
  callbacks: EscrowColumnCallbacks,
): ColumnDef<EscrowRow, any>[] {
  function getRowActions(row: EscrowRow): RowAction[] {
    const base: RowAction[] = [
      {
        label: "View Details",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onViewDetails(row),
      },
    ];

    if (row.transaction) {
      base.push({
        label: "View Transaction",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onViewTransaction(row),
        dividerAfter: true,
      });
    }

    if (row.buyer) {
      base.push({
        label: "View Buyer Profile",
        icon: <HiOutlineUser className="w-4 h-4" />,
        onClick: () => callbacks.onViewBuyerProfile(row),
      });
    }

    if (row.seller) {
      base.push({
        label: "View Seller Profile",
        icon: <HiOutlineUser className="w-4 h-4" />,
        onClick: () => callbacks.onViewSellerProfile(row),
        dividerAfter: true,
      });
    }

    if (row.buyer) {
      const buyerEmail = row.buyer.email;
      base.push({
        label: "Contact Buyer",
        icon: <IoMailOutline className="w-4 h-4" />,
        onClick: () => {
          window.location.href = `mailto:${buyerEmail}`;
        },
      });
    }

    if (row.seller) {
      const sellerEmail = row.seller.email;
      base.push({
        label: "Contact Seller",
        icon: <IoMailOutline className="w-4 h-4" />,
        onClick: () => {
          window.location.href = `mailto:${sellerEmail}`;
        },
      });
    }

    // if (row.status !== "refunded" && row.status !== "released") {
    //   base.push({
    //     label: "Refund",
    //     icon: <HiOutlineReceiptRefund className="w-4 h-4" />,
    //     variant: "danger",
    //     onClick: () => callbacks.onRefund(row),
    //   });
    // }

    return base;
  }

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
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <RowActionsMenu actions={getRowActions(row.original)} menuWidth={200} />
      ),
    },
  ];
}
