/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye, FiEdit3, FiCopy, FiArchive } from "react-icons/fi";
// import { MdOutlineStopCircle } from "react-icons/md";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { ReferralCampaignListItem } from "../types";

interface CampaignColumnCallbacks {
  onViewDetails: (campaign: ReferralCampaignListItem) => void;
  onEdit: (campaign: ReferralCampaignListItem) => void;
  onDuplicate: (campaign: ReferralCampaignListItem) => void;
  onPause: (campaign: ReferralCampaignListItem) => void;
  onArchive: (campaign: ReferralCampaignListItem) => void;
  onEnd: (campaign: ReferralCampaignListItem) => void;
}

const statusPillClass: Record<string, string> = {
  active: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  scheduled: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  ended: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
  draft: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  archived: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

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
): ColumnDef<ReferralCampaignListItem, any>[] {
  function getRowActions(row: ReferralCampaignListItem): RowAction[] {
    const status = row.status.toLowerCase();
    const base: RowAction[] = [
      {
        label: "View Details",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onViewDetails(row),
      },
    ];

    // nothing left to edit once a campaign has ended or been archived
    if (status !== "ended" && status !== "archived") {
      base.push({
        label: "Edit",
        icon: <FiEdit3 className="w-4 h-4" />,
        onClick: () => callbacks.onEdit(row),
      });
    }

    base.push({
      label: "Duplicate",
      icon: <FiCopy className="w-4 h-4" />,
      onClick: () => callbacks.onDuplicate(row),
    });

    // "Pause" removed — no endpoint, and "paused" isn't a real campaign status
    // if (status === "active") {
    //   base.push({
    //     label: "Pause",
    //     icon: <FiPause className="w-4 h-4" />,
    //     onClick: () => callbacks.onPause(row),
    //   });
    // }

    // already archived — nothing to archive
    if (status !== "archived") {
      base.push({
        label: "Archive",
        icon: <FiArchive className="w-4 h-4" />,
        variant: "danger",
        onClick: () => callbacks.onArchive(row),
      });
    }

    // only a running or upcoming campaign can be ended
    // if (status === "active" || status === "scheduled") {
    //   base.push({
    //     label: "End",
    //     icon: <MdOutlineStopCircle className="w-4 h-4" />,
    //     variant: "danger",
    //     onClick: () => callbacks.onEnd(row),
    //   });
    // }

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
            statusPillClass[row.original.status.toLowerCase()] ?? statusFallback
          }`}
        >
          {row.original.status}
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
