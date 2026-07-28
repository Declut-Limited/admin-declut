/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiEdit3 } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { ListingRow } from "../types";
import { CgDanger } from "react-icons/cg";

interface ListingColumnCallbacks {
  onViewDetails: (listing: ListingRow) => void;
  onEdit: (listing: ListingRow) => void;
  onDelist: (listing: ListingRow) => void;
  onRelist: (listing: ListingRow) => void;
}

const statusPillClass: Record<ListingRow["status"], string> = {
  Active: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  Sold: "text-[#5925DC] bg-[#F4F3FF] dark:text-purple-400 dark:bg-purple-950",
  "Pending Review":
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Flagged: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
  Delisted:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

export function createListingColumns(
  callbacks: ListingColumnCallbacks,
): ColumnDef<ListingRow, any>[] {
  function getRowActions(row: ListingRow): RowAction[] {
    const base: RowAction[] = [
      {
        label: "View Details",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onViewDetails(row),
      },
      {
        label: "Edit",
        icon: <FiEdit3 className="w-4 h-4" />,
        onClick: () => callbacks.onEdit(row),
      },
    ];

    if (row.status === "Delisted" || row.status === "Sold") {
      base.push({
        label: "Relist",
        icon: <BsCheckCircle className="w-4 h-4" />,
        variant: "success",
        onClick: () => callbacks.onRelist(row),
      });
    } else {
      base.push({
        label: "Delist",
        icon: <CgDanger className="w-4 h-4" />,
        variant: "danger",
        onClick: () => callbacks.onDelist(row),
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
      accessorKey: "name",
      header: "Listing",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#BFDBFE] dark:bg-indigo-950 flex items-center justify-center text-xs font-semibold text-[#2563EB] dark:text-indigo-400 shrink-0">
            {row.original.sellerInitials}
          </span>
          <div>
            <p className="font-medium text-brand-gray-dark dark:text-gray-100">
              {row.original.name}
            </p>
            <p className="text-xs text-brand-gray-light">{row.original.code}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "category", header: "Category" },
    {
      accessorKey: "sellerName",
      header: "Seller",
      cell: ({ row }) => (
        <a href="#" className="text-brand-blue underline-wavy">
          {row.original.sellerName}
        </a>
      ),
    },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "location", header: "Location" },
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
    { accessorKey: "date", header: "Date" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <RowActionsMenu actions={getRowActions(row.original)} />
      ),
    },
  ];
}
