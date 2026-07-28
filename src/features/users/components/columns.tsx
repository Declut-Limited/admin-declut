/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiAlertCircle, FiEdit3 } from "react-icons/fi";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import avatarPlaceholder from "@/assets/avatar.svg";
import { BsCheckCircle } from "react-icons/bs";
import type { UserRow } from "../types";

interface UserColumnCallbacks {
  onSuspend: (user: UserRow) => void;
  onReactivate: (user: UserRow) => void;
  onViewDetails: (user: UserRow) => void;
}

const statusPillClass: Record<UserRow["status"], string> = {
  Active: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  Pending: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
  Suspended: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
};

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
        onClick: () => console.log("edit", row.id),
      },
    ];

    if (row.status === "Active") {
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
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.original.avatarUrl || avatarPlaceholder}
            alt={row.original.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-brand-gray-dark dark:text-gray-100">
              {row.original.name}
            </p>
            <p className="text-xs text-brand-gray-light">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "listings", header: "Listings" },
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
    { accessorKey: "joined", header: "Joined" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <RowActionsMenu actions={getRowActions(row.original)} />,
    },
  ];
}