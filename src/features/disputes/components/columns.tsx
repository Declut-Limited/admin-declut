/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiSearch } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsCheckCircle } from "react-icons/bs";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { DisputeRow } from "../types";

interface DisputeColumnCallbacks {
  onViewDetails: (dispute: DisputeRow) => void;
  onInvestigate: (dispute: DisputeRow) => void;
  onDismiss: (dispute: DisputeRow) => void;
  onResolve: (dispute: DisputeRow) => void;
}

const statusPillClass: Record<string, string> = {
  new: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  investigating:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  dismissed:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  resolved: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
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

export function createDisputeColumns(
  callbacks: DisputeColumnCallbacks,
): ColumnDef<DisputeRow, any>[] {
  function getRowActions(row: DisputeRow): RowAction[] {
    const base: RowAction[] = [
      {
        label: "View Details",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onViewDetails(row),
      },
    ];

    if (row.status === "new") {
      base.push({
        label: "Investigate",
        icon: <FiSearch className="w-4 h-4" />,
        onClick: () => callbacks.onInvestigate(row),
      });
    }

    if (row.status !== "dismissed") {
      base.push({
        label: "Dismiss",
        icon: <IoIosCloseCircleOutline className="w-4 h-4" />,
        onClick: () => callbacks.onDismiss(row),
      });
    }

    if (row.status !== "resolved") {
      base.push({
        label: "Resolve",
        icon: <BsCheckCircle className="w-4 h-4" />,
        variant: "success",
        onClick: () => callbacks.onResolve(row),
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
      accessorKey: "slug",
      header: "Report",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => callbacks.onViewDetails(row.original)}
          className="text-brand-gray-dark hover:underline-wavy font-medium cursor-pointer"
        >
          {row.original.slug}
        </button>
      ),
    },
    {
      accessorKey: "listing",
      header: "Target",
      cell: ({ row }) =>
        row.original.listing ? (
          <span
            title={row.original.listing.title}
            className="text-brand-blue max-w-40 truncate block"
          >
            {row.original.listing.title}
          </span>
        ) : (
          <span className="text-brand-gray-light">—</span>
        ),
    },
    {
      accessorKey: "user",
      header: "Reporter",
      cell: ({ row }) =>
        row.original.user ? (
          <span className="text-brand-blue underline-wavy">
            {row.original.user.name}
          </span>
        ) : (
          <span className="text-brand-gray-light">—</span>
        ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <p
          className="max-w-xs truncate text-brand-gray-dark dark:text-gray-300"
          title={row.original.reason}
        >
          {row.original.reason}
        </p>
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
          {formatStatus(row.original.status)}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Reported",
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