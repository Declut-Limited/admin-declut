/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { HiOutlineReceiptRefund, HiOutlineUser } from "react-icons/hi2";
import { IoMailOutline } from "react-icons/io5";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { EscrowRow } from "../types";
import PartyCell from "./PartyCell";
import { TbReceipt } from "react-icons/tb";
import { BiPackage } from "react-icons/bi";

interface EscrowColumnCallbacks {
  onViewTransaction: (escrow: EscrowRow) => void;
  onViewBuyerProfile: (escrow: EscrowRow) => void;
  onViewSellerProfile: (escrow: EscrowRow) => void;
  onContactBuyer: (escrow: EscrowRow) => void;
  onContactSeller: (escrow: EscrowRow) => void;
  onRefund: (escrow: EscrowRow) => void;
  onDownloadReceipt: (txn: EscrowRow) => void;
  onViewItem: (txn: EscrowRow) => void;
}

const statusPillClass: Record<EscrowRow["status"], string> = {
  Held: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  Frozen: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Refunded: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
  Released: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

export function createEscrowColumns(
  callbacks: EscrowColumnCallbacks,
): ColumnDef<EscrowRow, any>[] {
  function getRowActions(row: EscrowRow): RowAction[] {
    const base: RowAction[] = [
      {
        label: "View Transaction",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onViewTransaction(row),
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
        dividerAfter: true
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
        dividerAfter: true
      },
      {
        label: "Contact Seller",
        icon: <IoMailOutline className="w-4 h-4" />,
        onClick: () => callbacks.onContactSeller(row),
      },
    ];

    if (row.status !== "Refunded" && row.status !== "Released") {
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
      accessorKey: "escrowId",
      header: "Escrow ID",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium text-brand-gray-dark dark:text-gray-200">
          {row.original.escrowId}
        </span>
      ),
    },
    {
      accessorKey: "transactionId",
      header: "Transaction ID",
      cell: ({ row }) => (
        <a
          href="#"
          className="text-brand-blue hover:underline-wavy whitespace-nowrap"
        >
          {row.original.transactionId}
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
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.product}</span>
      ),
    },
    {
      accessorKey: "amountHeld",
      header: "Amount Held",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.amountHeld}</span>
      ),
    },
    {
      accessorKey: "platformFee",
      header: "Platform Fee",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.platformFee}</span>
      ),
    },
    {
      accessorKey: "sellerReceivable",
      header: "Seller Receivable",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.sellerReceivable}
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
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <RowActionsMenu actions={getRowActions(row.original)} />
      ),
    },
  ];
}
