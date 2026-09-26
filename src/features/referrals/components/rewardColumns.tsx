/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiCheckCircle } from "react-icons/fi";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { ReferralRewardListItem } from "../types";

interface RewardColumnCallbacks {
  onView: (reward: ReferralRewardListItem) => void;
  onMarkPaid: (reward: ReferralRewardListItem) => void;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  allSelected: boolean;
  onToggleSelectAll: () => void;
}

const paymentPillClass: Record<string, string> = {
  pending: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  paid: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  canceled: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
};

const paymentFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatWord(word: string) {
  return word
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
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

export function createRewardColumns(
  callbacks: RewardColumnCallbacks,
): ColumnDef<ReferralRewardListItem, any>[] {
  function getRowActions(row: ReferralRewardListItem): RowAction[] {
    const base: RowAction[] = [
      {
        label: "View",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onView(row),
      },
    ];

    if (row.payment === "pending") {
      base.push({
        label: "Mark as Paid",
        icon: <FiCheckCircle className="w-4 h-4" />,
        onClick: () => callbacks.onMarkPaid(row),
      });
    }

    return base;
  }

  return [
    {
      id: "select",
      header: () => (
        <input
          type="checkbox"
          checked={callbacks.allSelected}
          onChange={callbacks.onToggleSelectAll}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={callbacks.selectedIds.has(row.original._id)}
          onChange={() => callbacks.onToggleSelect(row.original._id)}
          className="rounded border-gray-300"
        />
      ),
    },
    {
      id: "participant",
      header: "Participant",
      cell: ({ row }) => row.original.participant?.name ?? "—",
    },
    {
      id: "campaign",
      header: "Campaign",
      cell: ({ row }) => row.original.campaign?.name ?? "—",
    },
    {
      accessorKey: "reward",
      header: "Reward",
      cell: ({ row }) => currency.format(row.original.reward),
    },
    {
      accessorKey: "qualifiedOn",
      header: "Qualified On",
      cell: ({ row }) => formatDate(row.original.qualifiedOn),
    },
    {
      accessorKey: "payment",
      header: "Payment",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            paymentPillClass[row.original.payment] ?? paymentFallback
          }`}
        >
          {formatWord(row.original.payment)}
        </span>
      ),
    },
    {
      accessorKey: "schedule",
      header: "Schedule",
      cell: ({ row }) => formatWord(row.original.schedule),
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
