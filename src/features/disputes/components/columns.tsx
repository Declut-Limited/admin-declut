/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { BsCheckCircle } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { DisputeRow } from "../types";

interface DisputeColumnCallbacks {
  onViewDetails: (dispute: DisputeRow) => void;
  onDismiss: (dispute: DisputeRow) => void;
  onResolve: (dispute: DisputeRow) => void;
  onRemoveListing: (dispute: DisputeRow) => void;
}

const statusPillClass: Record<DisputeRow["status"], string> = {
  New: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  Investigating: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Dismissed: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  Resolved: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

export function createDisputeColumns(
  callbacks: DisputeColumnCallbacks,
): ColumnDef<DisputeRow, any>[] {
  function getRowActions(row: DisputeRow): RowAction[] {
    return [
      {
        label: "View Details",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onViewDetails(row),
      },
      {
        label: "Dismiss",
        icon: <IoIosCloseCircleOutline className="w-4 h-4" />,
        onClick: () => callbacks.onDismiss(row),
      },
      {
        label: "Resolve",
        icon: <BsCheckCircle className="w-4 h-4" />,
        variant: "success",
        onClick: () => callbacks.onResolve(row),
      },
      {
        label: "Remove Listing",
        icon: <RiDeleteBin6Line className="w-4 h-4" />,
        variant: "danger",
        onClick: () => callbacks.onRemoveListing(row),
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
    {
      accessorKey: "reportCode",
      header: "Report",
      cell: ({ row }) => (
        <a
          href="#"
          className="text-brand-gray-dark hover:underline-wavy font-medium"
        >
          {row.original.reportCode}
        </a>
      ),
    },
    {
      accessorKey: "target",
      header: "Target",
      cell: ({ row }) => (
        <a href="#" className="text-brand-blue">
          {row.original.target}
        </a>
      ),
    },
    {
      accessorKey: "reporterName",
      header: "Reporter",
      cell: ({ row }) => (
        <a href="#" className="text-brand-blue underline-wavy">
          {row.original.reporterName}
        </a>
      ),
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <p
          className="max-w-xs truncate text-brand-gray-dark dark:text-gray-300"
          title={row.original.reason}
        >
          {row.original.reason}
        </p>
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
    { accessorKey: "joined", header: "Joined" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <RowActionsMenu actions={getRowActions(row.original)} />
      ),
    },
  ];
}
