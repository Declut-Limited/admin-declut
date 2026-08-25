/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiFlag } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import StarRating from "@/components/generic/StarRating";
import type { ReviewRow } from "../types";

interface ReviewColumnCallbacks {
  onView: (review: ReviewRow) => void;
  onResolve: (review: ReviewRow) => void;
  onFlag: (review: ReviewRow) => void;
  onRemove: (review: ReviewRow) => void;
}

const statusClass: Record<string, string> = {
  visible: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  resolved: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  flagged: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
  hidden:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
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

export function createReviewColumns(
  callbacks: ReviewColumnCallbacks,
): ColumnDef<ReviewRow, any>[] {
  function getRowActions(row: ReviewRow): RowAction[] {
    const base: RowAction[] = [
      {
        label: "View",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onView(row),
      },
    ];

    if (row.status === "flagged") {
      base.push({
        label: "Resolve",
        icon: <BsCheckCircle className="w-4 h-4" />,
        variant: "success",
        onClick: () => callbacks.onResolve(row),
      });
    } else {
      base.push({
        label: "Flag",
        icon: <FiFlag className="w-4 h-4" />,
        onClick: () => callbacks.onFlag(row),
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
      accessorKey: "reviewer",
      header: "Reviewer",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
          >
            {row.original.reviewer ? getInitials(row.original.reviewer.name) : "—"}
          </span>
          <p className="font-medium text-brand-gray-dark dark:text-gray-100">
            {row.original.reviewer?.name ?? "—"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "listing",
      header: "On",
      cell: ({ row }) => (
        <p
          title={row.original.listing?.title}
          className="text-brand-blue hover:underline-wavy max-w-50 truncate"
        >
          {row.original.listing?.title ?? "—"}
        </p>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => <StarRating rating={row.original.rating} />,
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => (
        <p
          title={row.original.comment}
          className="text-brand-gray-dark dark:text-gray-300 max-w-xs truncate"
        >
          {row.original.comment}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            statusClass[row.original.status] ?? statusFallback
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