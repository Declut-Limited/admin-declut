/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { NotificationRow } from "../types";

interface NotificationColumnCallbacks {
  onViewDetails: (notif: NotificationRow) => void;
  onRemove: (notif: NotificationRow) => void;
}

const statusPillClass: Record<NotificationRow["status"], string> = {
  Draft: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  Scheduled: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Sent: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

export function createNotificationColumns(
  callbacks: NotificationColumnCallbacks,
): ColumnDef<NotificationRow, any>[] {
  function getRowActions(row: NotificationRow): RowAction[] {
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
      id: "select",
      header: () => <input type="checkbox" className="rounded border-gray-300" />,
      cell: () => <input type="checkbox" className="rounded border-gray-300" />,
    },
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "trigger",
      header: "Trigger",
      cell: ({ row }) =>
        row.original.triggerLink ? (
          <a href={row.original.triggerLink} className="text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950 rounded-md px-2 py-1 text-xs">
            {row.original.trigger}
          </a>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-brand-gray-dark dark:text-gray-300">
            {row.original.trigger}
          </span>
        ),
    },
    {
      accessorKey: "recipientName",
      header: "Recipient",
      cell: ({ row }) =>
        row.original.recipientAvatarUrl !== undefined ? (
          <div className="flex items-center gap-2">
            <img
              src={row.original.recipientAvatarUrl || avatarPlaceholder}
              alt={row.original.recipientName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-brand-gray-dark dark:text-gray-200">{row.original.recipientName}</span>
          </div>
        ) : (
          <span className="text-brand-gray-light">{row.original.recipientName}</span>
        ),
    },
    { accessorKey: "channel", header: "Channel" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusPillClass[row.original.status]}`}>
          {row.original.status}
        </span>
      ),
    },
    { accessorKey: "startDate", header: "Start Date" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <RowActionsMenu actions={getRowActions(row.original)} />,
    },
  ];
}