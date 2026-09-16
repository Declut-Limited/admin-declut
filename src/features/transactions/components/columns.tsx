/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import {  HiOutlineUser } from "react-icons/hi2";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import { TbReceipt } from "react-icons/tb";
import { BiPackage } from "react-icons/bi";
import { IoMailOutline } from "react-icons/io5";
import type { TransactionRow } from "../types";
import PartyCell from "./PartyCell";
import {
  escrowClass,
  inspectionClass,
  statusPillClass,
  statusFallback,
  currency,
  formatLabel,
  formatDate,
  formatCountdown,
} from "../statusStyles";

export interface TransactionColumnCallbacks {
  onViewDetails: (txn: TransactionRow) => void;
  onDownloadReceipt: (txn: TransactionRow) => void;
  onViewItem: (txn: TransactionRow) => void;
  onViewBuyerProfile: (txn: TransactionRow) => void;
  onViewSellerProfile: (txn: TransactionRow) => void;
  onRefund: (txn: TransactionRow) => void;
}

export function createTransactionColumns(
  callbacks: TransactionColumnCallbacks,
): ColumnDef<TransactionRow, any>[] {
  function getRowActions(row: TransactionRow): RowAction[] {
    const base: RowAction[] = [
      {
        label: "View Details",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onViewDetails(row),
      },
      {
        label: "Download Receipt",
        icon: <TbReceipt className="w-4 h-4" />,
        onClick: () => callbacks.onDownloadReceipt(row),
      },
    ];

    if (row.listing) {
      base.push({
        label: "View Item",
        icon: <BiPackage className="w-4 h-4" />,
        onClick: () => callbacks.onViewItem(row),
      });
    }

    if (row.buyer) {
      base.push({
        label: "View Buyer Profile",
        icon: <HiOutlineUser className="w-4 h-4" />,
        onClick: () => callbacks.onViewBuyerProfile(row),
        dividerAfter: true,
      });
    }

    if (row.seller) {
      base.push({
        label: "View Seller Profile",
        icon: <HiOutlineUser className="w-4 h-4" />,
        onClick: () => callbacks.onViewSellerProfile(row),
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
        dividerAfter: true,
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

    // if (row.status !== "refunded" && row.status !== "completed") {
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
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <RowActionsMenu actions={getRowActions(row.original)} menuWidth={200} />
      ),
    },
  ];
}
