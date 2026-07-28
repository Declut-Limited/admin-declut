/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEdit3, FiEyeOff, FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { CategoryRow } from "../types";

interface CategoryColumnCallbacks {
  onEdit: (category: CategoryRow) => void;
  onToggleVisibility: (category: CategoryRow) => void;
  onRemove: (category: CategoryRow) => void;
}

const statusPillClass: Record<CategoryRow["status"], string> = {
  Active: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  Hidden: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

export function createCategoryColumns(
  callbacks: CategoryColumnCallbacks,
): ColumnDef<CategoryRow, any>[] {
  function getRowActions(row: CategoryRow): RowAction[] {
    return [
      {
        label: "Edit",
        icon: <FiEdit3 className="w-4 h-4" />,
        onClick: () => callbacks.onEdit(row),
      },
      {
        label: row.status === "Hidden" ? "Show" : "Hide",
        icon: row.status === "Hidden" ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />,
        onClick: () => callbacks.onToggleVisibility(row),
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
    { accessorKey: "name", header: "Category" },
    { accessorKey: "listings", header: "Listings" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusPillClass[row.original.status]}`}>
          {row.original.status}
        </span>
      ),
    },
    { accessorKey: "created", header: "Created" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <RowActionsMenu actions={getRowActions(row.original)} />,
    },
  ];
}