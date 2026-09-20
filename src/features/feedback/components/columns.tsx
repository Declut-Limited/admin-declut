/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import { MdOutlineRateReview } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import StarRating from "@/components/generic/StarRating";
import { getInitials } from "@/lib/utils/getInitials";
import { statusLabels, statusPillClass, typeLabels, typePillClass } from "../mockData";
import type { FeedbackListItem } from "../types";

interface FeedbackColumnCallbacks {
  onViewDetails: (row: FeedbackListItem) => void;
  onMarkInReview: (row: FeedbackListItem) => void;
  onMarkResolved: (row: FeedbackListItem) => void;
  onEscalate: (row: FeedbackListItem) => void;
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

export function createFeedbackColumns(
  callbacks: FeedbackColumnCallbacks,
  compact = false,
): ColumnDef<FeedbackListItem, any>[] {
  function getRowActions(row: FeedbackListItem): RowAction[] {
    const actions: RowAction[] = [];

    if (row.status !== "resolved") {
      actions.push({
        label: "Mark as Resolved",
        icon: <BsCheckCircle className="w-4 h-4" />,
        variant: "success",
        onClick: () => callbacks.onMarkResolved(row),
      });
    }

    actions.push({
      label: "View Details",
      icon: <FiEye className="w-4 h-4" />,
      onClick: () => callbacks.onViewDetails(row),
    });

    if (row.status !== "in_review") {
      actions.push({
        label: "Mark as In Review",
        icon: <MdOutlineRateReview className="w-4 h-4" />,
        onClick: () => callbacks.onMarkInReview(row),
      });
    }

    if (row.status !== "escalated") {
      actions.push({
        label: "Escalate",
        icon: <TbAlertTriangle className="w-4 h-4" />,
        variant: "danger",
        dividerAfter: false,
        onClick: () => callbacks.onEscalate(row),
      });
    }

    return actions;
  }

  return [
    {
      id: "select",
      header: () => <input type="checkbox" className="rounded border-gray-300" />,
      cell: () => <input type="checkbox" className="rounded border-gray-300" />,
    },
    {
      accessorKey: "slug",
      header: "ID",
      cell: ({ row }) => (
        <span className="text-brand-blue font-medium whitespace-nowrap">
          {row.original.slug}
        </span>
      ),
    },
    {
      id: "user",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
          >
            {getInitials(row.original.user.name)}
          </span>
          <div>
            <p className="font-medium text-brand-gray-dark dark:text-gray-100">
              {row.original.user.name}
            </p>
            <p className="text-xs text-brand-gray-light">{row.original.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${typePillClass[row.original.type]}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
          {typeLabels[row.original.type]}
        </span>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <StarRating rating={row.original.rating} size="w-3.5 h-3.5" />
          <span className="text-xs text-brand-gray-dark dark:text-gray-300">
            {row.original.rating}/5
          </span>
          {row.original.isLowRated && (
            <span className="text-xs font-medium text-[#B42318] dark:text-red-400">Low</span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "feedbackDescription",
      header: "Feedback",
      cell: ({ row }) => (
        <p
          title={row.original.feedbackDescription}
          className="text-brand-gray-dark dark:text-gray-300 max-w-xs truncate"
        >
          {row.original.feedbackDescription}
        </p>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Submitted",
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDate(row.original.createdAt)}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusPillClass[row.original.status]}`}
        >
          {statusLabels[row.original.status]}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) =>
        compact ? (
          <button
            type="button"
            onClick={() => callbacks.onViewDetails(row.original)}
            aria-label="View details"
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            <FiEye className="w-4 h-4 text-brand-gray-dark dark:text-gray-300" />
          </button>
        ) : (
          <RowActionsMenu actions={getRowActions(row.original)} menuWidth={200} />
        ),
    },
  ];
}
