/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import StarRating from "@/components/generic/StarRating";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { ReviewRow } from "../types";

interface ReviewColumnCallbacks {
  onView: (review: ReviewRow) => void;
  onResolve: (review: ReviewRow) => void;
}

const statusClass: Record<ReviewRow["status"], string> = {
  Published: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  Flagged: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
};

export function createReviewColumns(
  callbacks: ReviewColumnCallbacks,
): ColumnDef<ReviewRow, any>[] {
  function getRowActions(row: ReviewRow): RowAction[] {
    const base: RowAction[] = [
      {
        label: "View",
        icon: <FiEye className="w-4 h-4" />,
        onClick: () => callbacks.onView(row),
      },
    ];

    if (row.status === "Flagged") {
      base.push({
        label: "Resolve",
        icon: <BsCheckCircle className="w-4 h-4" />,
        variant: "success",
        onClick: () => callbacks.onResolve(row),
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
    {
      accessorKey: "reviewerName",
      header: "Reviewer",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <img
            src={row.original.reviewerAvatarUrl || avatarPlaceholder}
            alt={row.original.reviewerName}
            className="w-8 h-8 rounded-full object-cover"
          />
          <p className="font-medium text-brand-gray-dark dark:text-gray-100">
            {row.original.reviewerName}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "listingName",
      header: "On",
      cell: ({ row }) => (
        <p title={row.original.listingName} className="text-brand-blue hover:underline-wavy max-w-50 truncate">
          {row.original.listingName}
        </p>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => <StarRating rating={row.original.rating} />,
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => (
        <p title={row.original.comment} className="text-brand-gray-dark dark:text-gray-300 max-w-xs truncate">
          {row.original.comment}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusClass[row.original.status]}`}
        >
          {row.original.status}
        </span>
      ),
    },
    { accessorKey: "date", header: "Date" },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <RowActionsMenu actions={getRowActions(row.original)} />
      ),
    },
  ];
}
