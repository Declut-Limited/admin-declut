/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { ActivityLogRow } from "../types";

interface ActivityLogColumnCallbacks {
  onViewDetails: (log: ActivityLogRow) => void;
  onRemove: (log: ActivityLogRow) => void;
}

export function createActivityLogColumns(
  callbacks: ActivityLogColumnCallbacks,
): ColumnDef<ActivityLogRow, any>[] {
  function getRowActions(row: ActivityLogRow): RowAction[] {
    return [
      {
        label: "View Details",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onViewDetails(row),
      },
      {
        label: "Remove",
        icon: <RiDeleteBin6Line className="w-4 h-4" />,
        variant: "danger",
        onClick: () => callbacks.onRemove(row),
      },
    ];
  }

  return [
    {
      accessorKey: "actorName",
      header: "Actor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.original.actorAvatarUrl || avatarPlaceholder}
            alt={row.original.actorName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="font-medium text-brand-gray-dark dark:text-gray-100">{row.original.actorName}</p>
        </div>
      ),
    },
    { accessorKey: "action", header: "Action" },
    {
      accessorKey: "target",
      header: "Target",
      cell: ({ row }) =>
        row.original.targetLink ? (
          <a href={row.original.targetLink} className="text-brand-blue underline-wavy">
            {row.original.target}
          </a>
        ) : (
          <span className="text-brand-gray-light">{row.original.target}</span>
        ),
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#F2F4F7] dark:bg-gray-800 text-xs font-medium text-brand-gray-dark dark:text-gray-300">
          {row.original.ipAddress}
        </span>
      ),
    },
    { accessorKey: "timestamp", header: "Timestamp" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <RowActionsMenu actions={getRowActions(row.original)} />,
    },
  ];
}