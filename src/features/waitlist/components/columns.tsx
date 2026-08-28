/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiSend, FiCopy } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { WaitlistUser } from "../types";

interface WaitlistColumnCallbacks {
  onSendInvite: (user: WaitlistUser) => void;
  onCopyEmail: (user: WaitlistUser) => void;
  onRemove: (user: WaitlistUser) => void;
}

const statusPillClass: Record<string, string> = {
  waiting: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  invited: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  joined: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  unsubscribed: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
};

const inviteStatusClass: Record<string, string> = {
  not_sent: "text-brand-gray-light",
  sent: "text-[#027A48]",
  delivered: "text-brand-blue",
  opened: "text-[#B54708]",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

function formatLabel(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(iso: string | null) {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function createWaitlistColumns(
  callbacks: WaitlistColumnCallbacks,
): ColumnDef<WaitlistUser, any>[] {
  function getRowActions(row: WaitlistUser): RowAction[] {
    return [
      {
        label: "Send Invite",
        icon: <FiSend className="w-4 h-4" />,
        variant: "brand",
        onClick: () => callbacks.onSendInvite(row),
      },
      {
        label: "Copy Email",
        icon: <FiCopy className="w-4 h-4" />,
        onClick: () => callbacks.onCopyEmail(row),
      },
      {
        label: "Remove",
        icon: <IoIosCloseCircleOutline className="w-4 h-4" />,
        variant: "danger",
        onClick: () => callbacks.onRemove(row),
      },
    ];
  }

  return [
    {
      id: "select",
      header: () => (
        <input type="checkbox" className="rounded border-gray-300" />
      ),
      cell: () => <input type="checkbox" className="rounded border-gray-300" />,
    },
    { accessorKey: "email", header: "User" },
    {
      accessorKey: "interest",
      header: "Interest",
      cell: ({ row }) => formatLabel(row.original.interest),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => formatDate(row.original.createdAt),
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
      accessorKey: "inviteStatus",
      header: "Invite Status",
      cell: ({ row }) => (
        <span
          className={`text-xs font-medium ${
            inviteStatusClass[row.original.inviteStatus] ??
            "text-brand-gray-light"
          }`}
        >
          {formatLabel(row.original.inviteStatus)}
        </span>
      ),
    },
    {
      accessorKey: "lastContacted",
      header: "Last Contacted",
      cell: ({ row }) => formatDate(row.original.lastContacted ?? null),
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
