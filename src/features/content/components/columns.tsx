/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEdit3, FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import type { ContentRow } from "../types";
import { MdOutlineUnpublished } from "react-icons/md";
import { BsCheckCircle } from "react-icons/bs";

interface ContentColumnCallbacks {
  onViewDetails: (content: ContentRow) => void;
  onEdit: (content: ContentRow) => void;
  onTogglePublish: (content: ContentRow) => void;
  onRemove: (content: ContentRow) => void;
}

const statusPillClass: Record<string, string> = {
  draft: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  published:
    "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

function formatLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatType(type: string) {
  return type === "faq" ? "FAQ" : formatLabel(type);
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

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
        label: "Edit",
        icon: <FiEdit3 className="w-4 h-4" />,
        onClick: () => callbacks.onEdit(row),
      },
      row.status === "published"
        ? {
            label: "Unpublish",
            icon: <MdOutlineUnpublished className="w-4 h-4" />,
            onClick: () => callbacks.onTogglePublish(row),
          }
        : {
            label: "Publish",
            icon: <BsCheckCircle className="w-4 h-4" />,
            variant: "success",
            onClick: () => callbacks.onTogglePublish(row),
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
    { accessorKey: "slug", header: "ID" },
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "contentType",
      header: "Type",
      cell: ({ row }) => formatType(row.original.contentType),
    },
    { accessorKey: "whereToAppear", header: "Placement" },
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
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => formatDate(row.original.updatedAt),
    },
    {
      accessorKey: "createdBy",
      header: "Author",
      cell: ({ row }) =>
        row.original.createdBy ? (
          <span className="text-brand-blue hover:underline-wavy">
            {row.original.createdBy.name}
          </span>
        ) : (
          <span className="text-brand-gray-light">—</span>
        ),
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
