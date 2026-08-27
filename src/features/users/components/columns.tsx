/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiAlertCircle, FiEdit3 } from "react-icons/fi";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import { BsCheckCircle } from "react-icons/bs";
import type { UserRow } from "../types";

interface UserColumnCallbacks {
  onSuspend: (user: UserRow) => void;
  onEdit: (user: UserRow) => void;
  onReactivate: (user: UserRow) => void;
  onViewDetails: (user: UserRow) => void;
}

const statusPillClass: Record<string, string> = {
  active: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  pending: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  suspended: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  banned: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
};

const statusFallbackClass =
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatJoinedDate(iso: string) {
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

export function createUserColumns(
  callbacks: UserColumnCallbacks,
): ColumnDef<UserRow, any>[] {
  function getRowActions(row: UserRow): RowAction[] {
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

    if (row.status === "active") {
      base.push({
        label: "Suspend",
        icon: <FiAlertCircle className="w-4 h-4" />,
        variant: "danger",
        onClick: () => callbacks.onSuspend(row),
      });
    } else {
      base.push({
        label: "Reactivate",
        icon: <BsCheckCircle className="w-4 h-4" />,
        variant: "success",
        onClick: () => callbacks.onReactivate(row),
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
      id: "slug",
      header: "ID",
      cell: ({ row }) =>
        row.original.slug ? (
          <span className="text-xs font-medium text-brand-gray-light">
            {row.original.slug}
          </span>
        ) : (
          <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
        ),
    },
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
          >
            {getInitials(row.original.name)}
          </div>
          <div>
            <p className="font-medium text-brand-gray-dark dark:text-gray-100">
              {row.original.name}
            </p>
            <p className="text-xs text-brand-gray-light">
              {row.original.email}
            </p>
          </div>
        </div>
      ),
    },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "listingsCount", header: "Listings" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            statusPillClass[row.original.status] ?? statusFallbackClass
          }`}
        >
          {formatStatus(row.original.status)}
        </span>
      ),
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => formatJoinedDate(row.original.joinedAt),
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
