/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiFileText, FiFlag } from "react-icons/fi";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { Reward } from "../types";

interface RewardColumnCallbacks {
  onView: (reward: Reward) => void;
  onDownloadReceipt: (reward: Reward) => void;
  onPay: (reward: Reward) => void;
}

const paymentClass: Record<string, string> = {
  pending: "text-[#B54708]",
  paid: "text-[#027A48]",
};

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
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
): ColumnDef<Reward, any>[] {
  function getRowActions(row: Reward): RowAction[] {
    const base: RowAction[] = [
      {
        label: "View",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onView(row),
      },
      {
        label: "Download Receipt",
        icon: <FiFileText className="w-4 h-4" />,
        onClick: () => callbacks.onDownloadReceipt(row),
      },
    ];

    if (row.payment === "pending") {
      base.push({
        label: "Pay",
        icon: <FiFlag className="w-4 h-4" />,
        onClick: () => callbacks.onPay(row),
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
    { accessorKey: "id", header: "Reward ID" },
    { accessorKey: "participant", header: "Participant" },
    { accessorKey: "campaign", header: "Campaign" },
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
          className={`text-xs font-medium ${paymentClass[row.original.payment] ?? "text-brand-gray-light"}`}
        >
          {formatStatus(row.original.payment)}
        </span>
      ),
    },
    { accessorKey: "schedule", header: "Schedule" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <RowActionsMenu actions={getRowActions(row.original)} />
      ),
    },
  ];
}