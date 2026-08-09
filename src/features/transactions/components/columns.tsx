/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { HiOutlineReceiptRefund, HiOutlineUser } from "react-icons/hi2";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { TransactionRow } from "../types";
import PartyCell from "./PartyCell";
import { TbReceipt } from "react-icons/tb";
import { BiPackage } from "react-icons/bi";
import { IoMailOutline } from "react-icons/io5";

interface TransactionColumnCallbacks {
  onViewDetails: (txn: TransactionRow) => void;
  onDownloadReceipt: (txn: TransactionRow) => void;
  onViewItem: (txn: TransactionRow) => void;
  onViewBuyerProfile: (txn: TransactionRow) => void;
  onViewSellerProfile: (txn: TransactionRow) => void;
  onContactBuyer: (txn: TransactionRow) => void;
  onContactSeller: (txn: TransactionRow) => void;
  onRefund: (txn: TransactionRow) => void;
}

const escrowClass: Record<TransactionRow["escrow"], string> = {
  Held: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  Released: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  Refunded: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
};

const inspectionClass: Record<TransactionRow["inspection"], string> = {
  Awaiting: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Completed:
    "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  Failed: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
};

const statusPillClass: Record<TransactionRow["status"], string> = {
  Active: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  Completed: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  Refunded: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
  Disputed: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
};

function getCountdownHours(countdown: string): number {
  const match = countdown.match(/(\d+)h/);
  return match ? parseInt(match[1], 10) : 0;
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
      {
        label: "View Item",
        icon: <BiPackage className="w-4 h-4" />,
        onClick: () => callbacks.onViewItem(row),
      },
      {
        label: "View Buyer Profile",
        icon: <HiOutlineUser className="w-4 h-4" />,
        onClick: () => callbacks.onViewBuyerProfile(row),
      },
      {
        label: "View Seller Profile",
        icon: <HiOutlineUser className="w-4 h-4" />,
        onClick: () => callbacks.onViewSellerProfile(row),
      },
      {
        label: "Contact Buyer",
        icon: <IoMailOutline className="w-4 h-4" />,
        onClick: () => callbacks.onContactBuyer(row),
      },
      {
        label: "Contact Seller",
        icon: <IoMailOutline className="w-4 h-4" />,
        onClick: () => callbacks.onContactSeller(row),
      },
    ];

    if (row.status !== "Refunded" && row.status !== "Completed") {
      base.push({
        label: "Refund",
        icon: <HiOutlineReceiptRefund className="w-4 h-4" />,
        variant: "danger",
        onClick: () => callbacks.onRefund(row),
      });
    }

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
      accessorKey: "transactionCode",
      header: "Transaction",
      cell: ({ row }) => (
        <a
          href="#"
          className="text-brand-blue hover:underline-wavy font-medium"
        >
          {row.original.transactionCode}
        </a>
      ),
    },
    {
      accessorKey: "buyerName",
      header: "Buyer",
      cell: ({ row }) => (
        <PartyCell
          name={row.original.buyerName}
          email={row.original.buyerEmail}
          avatarUrl={row.original.buyerAvatarUrl}
        />
      ),
    },
    {
      accessorKey: "sellerName",
      header: "Seller",
      cell: ({ row }) => (
        <PartyCell
          name={row.original.sellerName}
          email={row.original.sellerEmail}
          avatarUrl={row.original.sellerAvatarUrl}
        />
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.amount}</span>
      ),
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.product}</span>
      ),
    },
    {
      accessorKey: "escrow",
      header: "Escrow",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${escrowClass[row.original.escrow]}`}
        >
          {row.original.escrow}
        </span>
      ),
    },
    {
      accessorKey: "inspection",
      header: "Inspection",
      cell: ({ row }) =>
        row.original.inspection === "Failed" ||
        row.original.escrow === "Refunded" ? (
          <span className="text-brand-gray-light">-</span>
        ) : (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${inspectionClass[row.original.inspection]}`}
          >
            {row.original.inspection}
          </span>
        ),
    },
    {
      accessorKey: "countdown",
      header: "Countdown",
      cell: ({ row }) =>
        row.original.countdown === "-" ? (
          <span className="text-brand-gray-light">-</span>
        ) : (
          <span
            className={
              getCountdownHours(row.original.countdown) < 5
                ? "text-[#F04438] dark:text-red-400"
                : "text-[#F79009] dark:text-amber-400"
            }
          >
            {row.original.countdown}
          </span>
        ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusPillClass[row.original.status]}`}
        >
          {row.original.status}
        </span>
      ),
    },

    {
      accessorKey: "created",
      header: "Created",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.created}</span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <RowActionsMenu actions={getRowActions(row.original)} />
      ),
    },
  ];
}
