/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
// import { FiEye } from "react-icons/fi";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import RowActionsMenu, {
//   type RowAction,
// } from "@/components/generic/RowActionsMenu";
import type { NotificationRow } from "../types";

// interface NotificationColumnCallbacks {
//   onViewDetails: (notif: NotificationRow) => void;
//   onRemove: (notif: NotificationRow) => void;
// }

const statusPillClass: Record<string, string> = {
  sent: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  sending: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  scheduled:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  failed: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
  draft: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatChannel(channel: string) {
  if (channel === "both") return "PUSH + EMAIL";
  return channel.toUpperCase();
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

export function createNotificationColumns(
  // callbacks: NotificationColumnCallbacks,
): ColumnDef<NotificationRow, any>[] {
  // function getRowActions(row: NotificationRow): RowAction[] {
  //   return [
  //     {
  //       label: "View Details",
  //       icon: <FiEye className="w-4 h-4" />,
  //       onClick: () => callbacks.onViewDetails(row),
  //     },
  //     {
  //       label: "Remove",
  //       icon: <RiDeleteBin6Line className="w-4 h-4" />,
  //       variant: "danger",
  //       onClick: () => callbacks.onRemove(row),
  //     },
  //   ];
  // }

  return [
    {
      id: "select",
      header: () => (
        <input type="checkbox" className="rounded border-gray-300" />
      ),
      cell: () => <input type="checkbox" className="rounded border-gray-300" />,
    },
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "trigger",
      header: "Trigger",
      cell: ({ row }) => (
        <span className="text-brand-blue">
          {formatLabel(row.original.trigger)}
        </span>
      ),
    },
    {
      accessorKey: "recipientDescription",
      header: "Recipient",
      cell: ({ row }) => (
        <div>
          <p className="text-brand-gray-dark dark:text-gray-200">
            {row.original.recipientDescription}
          </p>
          <p className="text-xs text-brand-gray-light">
            {row.original.recipientCount.toLocaleString()} recipient
            {row.original.recipientCount === 1 ? "" : "s"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "channel",
      header: "Channel",
      cell: ({ row }) => formatChannel(row.original.channel),
    },
    {
      id: "delivery",
      header: "Delivery",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#027A48]">{row.original.sentCount} sent</span>
          {row.original.failedCount > 0 && (
            <span className="text-[#B42318]">
              {row.original.failedCount} failed
            </span>
          )}
        </div>
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
          {formatLabel(row.original.status)}
        </span>
      ),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => formatDate(row.original.startDate),
    },
    // {
    //   id: "actions",
    //   header: "Action",
    //   cell: ({ row }) => (
    //     <RowActionsMenu actions={getRowActions(row.original)} />
    //   ),
    // },
  ];
}