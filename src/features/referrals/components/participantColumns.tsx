/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import type { Participant } from "../types";

interface ParticipantColumnCallbacks {
  onViewDetails: (participant: Participant) => void;
}

const statusPillClass: Record<string, string> = {
  qualified: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  approved: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  expired: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
  in_progress:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  disqualified:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

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
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function createParticipantColumns(
  callbacks: ParticipantColumnCallbacks,
): ColumnDef<Participant, any>[] {
  return [
    {
      id: "select",
      header: () => (
        <input type="checkbox" className="rounded border-gray-300" />
      ),
      cell: () => <input type="checkbox" className="rounded border-gray-300" />,
    },
    { accessorKey: "name", header: "Participant" },
    { accessorKey: "campaignName", header: "Campaign Name" },
    { accessorKey: "referredUsers", header: "Referred Users" },
    { accessorKey: "qualified", header: "Qualified" },
    { accessorKey: "ownTransactions", header: "Own Transactions" },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="participant-progress-track">
            <span
              className="participant-progress-fill"
              style={{ width: `${row.original.progress}%` }}
            />
          </span>
          <span className="text-xs text-brand-gray-dark dark:text-gray-300">
            {row.original.progress}%
          </span>
        </div>
      ),
    },
    {
      accessorKey: "deadline",
      header: "Deadline",
      cell: ({ row }) => formatDate(row.original.deadline),
    },
    {
      accessorKey: "reward",
      header: "Reward",
      cell: ({ row }) => currency.format(row.original.reward),
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
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => callbacks.onViewDetails(row.original)}
          className="text-brand-gray-light hover:text-brand-gray-dark cursor-pointer"
          aria-label="View participant"
        >
          <FiEye className="w-4 h-4" />
        </button>
      ),
    },
  ];
}