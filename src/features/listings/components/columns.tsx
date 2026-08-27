/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiEdit3, FiFlag } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { ListingRow } from "../types";
import { CgDanger } from "react-icons/cg";
import { RiDeleteBin6Line } from "react-icons/ri";

interface ListingColumnCallbacks {
  onViewDetails: (listing: ListingRow) => void;
  onEdit: (listing: ListingRow) => void;
  onDelist: (listing: ListingRow) => void;
  onRelist: (listing: ListingRow) => void;
  onFlag: (listing: ListingRow) => void;
  onUnflag: (listing: ListingRow) => void;
  onRemove: (listing: ListingRow) => void;
}

const statusPillClass: Record<string, string> = {
  active: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  sold: "text-[#5925DC] bg-[#F4F3FF] dark:text-purple-400 dark:bg-purple-950",
  pending_review:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  flagged: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
  delisted:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  deleted: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
};

const statusFallback =
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatStatus(status: string) {
  return status
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

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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

    if (row.status === "flagged") {
      base.push({
        label: "Unflag",
        icon: <BsCheckCircle className="w-4 h-4" />,
        variant: "success",
        onClick: () => callbacks.onUnflag(row),
      });
    } else if (row.status === "active") {
      base.push({
        label: "Flag",
        icon: <FiFlag className="w-4 h-4" />,
        onClick: () => callbacks.onFlag(row),
      });
    }

    if (row.status === "delisted" || row.status === "deleted") {
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

    base.push({
      label: "Remove",
      icon: <RiDeleteBin6Line className="w-4 h-4" />,
      variant: "danger",
      onClick: () => callbacks.onRemove(row),
    });

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
      accessorKey: "title",
      header: "Listing",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#BFDBFE] dark:bg-indigo-950 flex items-center justify-center text-xs font-semibold text-brand-blue dark:text-indigo-400 shrink-0">
            {getInitials(row.original.title)}
          </span>
          <div>
            <p className="font-medium text-brand-gray-dark dark:text-gray-100">
              {row.original.title}
            </p>
            <p className="text-xs text-brand-gray-light">
              {row.original.slug ?? "—"}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => row.original.category?.title ?? "—",
    },
    {
      accessorKey: "seller",
      header: "Seller",
      cell: ({ row }) =>
        row.original.seller ? (
          <a href="#" className="text-brand-blue underline-wavy">
            {row.original.seller.name}
          </a>
        ) : (
          <span className="text-brand-gray-light">—</span>
        ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => currency.format(row.original.price),
    },
    { accessorKey: "locationLabel", header: "Location" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            statusPillClass[row.original.status] ?? statusFallback
          }`}
        >
          {formatStatus(row.original.status)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => formatDate(row.original.createdAt),
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
