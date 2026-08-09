/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { PromotionRow } from "../types";

interface PromotionColumnCallbacks {
  onViewDetails: (promo: PromotionRow) => void;
  onRemove: (promo: PromotionRow) => void;
}

const statusPillClass: Record<PromotionRow["status"], string> = {
  Scheduled:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Active: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  Ended: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

export function createPromotionColumns(
  callbacks: PromotionColumnCallbacks,
): ColumnDef<PromotionRow, any>[] {
  function getRowActions(row: PromotionRow): RowAction[] {
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
      header: () => (
        <input type="checkbox" className="rounded border-gray-300" />
      ),
      cell: () => <input type="checkbox" className="rounded border-gray-300" />,
    },
    { accessorKey: "campaignName", header: "Campaign" },
    { accessorKey: "type", header: "Type" },
    {
      accessorKey: "appliesTo",
      header: "Applies To",
      cell: ({ row }) => (
        <div>
          <p className="text-brand-gray-dark dark:text-gray-200">
            {row.original.appliesTo}
          </p>
          <p className="text-xs text-brand-gray-light">
            {row.original.eligibleAudience}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "application",
      header: "Application",
      cell: ({ row }) =>
        row.original.application === "-" ? (
          <span className="text-brand-gray-light">-</span>
        ) : row.original.application === "Automatic" ? (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#EFF8FF] dark:bg-blue-950 text-xs font-medium text-[#175CD3] dark:text-blue-400">
            {row.original.application}
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-brand-gray-dark dark:text-gray-300">
            {row.original.application}
          </span>
        ),
    },
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
    { accessorKey: "startDate", header: "Start Date" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <RowActionsMenu actions={getRowActions(row.original)} />
      ),
    },
  ];
}
