/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { ContentRow } from "../types";

interface ContentColumnCallbacks {
  onViewDetails: (content: ContentRow) => void;
  onRemove: (content: ContentRow) => void;
}

const statusPillClass: Record<ContentRow["status"], string> = {
  Draft: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  Published: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

export function createContentColumns(
  callbacks: ContentColumnCallbacks,
): ColumnDef<ContentRow, any>[] {
  function getRowActions(row: ContentRow): RowAction[] {
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
    { accessorKey: "type", header: "Type" },
    { accessorKey: "placement", header: "Placement" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusPillClass[row.original.status]}`}>
          {row.original.status}
        </span>
      ),
    },
    { accessorKey: "updated", header: "Updated" },
    {
      accessorKey: "authorName",
      header: "Author",
      cell: ({ row }) => (
        <a href="#" className="text-brand-blue hover:underline-wavy">
          {row.original.authorName}
        </a>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <RowActionsMenu actions={getRowActions(row.original)} />,
    },
  ];
}