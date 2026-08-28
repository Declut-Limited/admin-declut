/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiEdit3, FiCopy, FiPause, FiArchive } from "react-icons/fi";
import { MdOutlineStopCircle } from "react-icons/md";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { Campaign } from "../types";

interface CampaignColumnCallbacks {
  onViewDetails: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
  onDuplicate: (campaign: Campaign) => void;
  onPause: (campaign: Campaign) => void;
  onArchive: (campaign: Campaign) => void;
  onEnd: (campaign: Campaign) => void;
}

const statusPillClass: Record<string, string> = {
  active: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  scheduled: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  ended: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  paused: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  draft: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  archived: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

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

export function createCampaignColumns(
  callbacks: CampaignColumnCallbacks,
): ColumnDef<Campaign, any>[] {
  function getRowActions(row: Campaign): RowAction[] {
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
      {
        label: "Duplicate",
        icon: <FiCopy className="w-4 h-4" />,
        onClick: () => callbacks.onDuplicate(row),
      },
    ];

    if (row.status === "active") {
      base.push({
        label: "Pause",
        icon: <FiPause className="w-4 h-4" />,
        onClick: () => callbacks.onPause(row),
      });
    }

    base.push({
      label: "Archive",
      icon: <FiArchive className="w-4 h-4" />,
      onClick: () => callbacks.onArchive(row),
    });

    if (row.status !== "ended") {
      base.push({
        label: "End",
        icon: <MdOutlineStopCircle className="w-4 h-4" />,
        variant: "danger",
        onClick: () => callbacks.onEnd(row),
      });
    }

    return base;
  }

  return [
    {
      id: "select",
      header: () => <input type="checkbox" className="rounded border-gray-300" />,
      cell: () => <input type="checkbox" className="rounded border-gray-300" />,
    },
    { accessorKey: "name", header: "Campaign Name" },
    {
      accessorKey: "reward",
      header: "Reward",
      cell: ({ row }) => currency.format(row.original.reward),
    },
    {
      accessorKey: "from",
      header: "From",
      cell: ({ row }) => formatDate(row.original.from),
    },
    {
      accessorKey: "to",
      header: "To",
      cell: ({ row }) => formatDate(row.original.to),
    },
    {
      accessorKey: "requirement",
      header: "Requirement",
      cell: ({ row }) => (
        <span className="text-brand-blue">{row.original.requirement}</span>
      ),
    },
    { accessorKey: "participants", header: "Participants" },
    { accessorKey: "qualified", header: "Qualified" },
    { accessorKey: "paid", header: "Paid" },
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
    { accessorKey: "createdBy", header: "Created By" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <RowActionsMenu actions={getRowActions(row.original)} />,
    },
  ];
}