/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from "@tanstack/react-table";
import { FiEye } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
// import avatarPlaceholder from "@/assets/avatar.svg";
import type { ActivityLogRow } from "../types";
import {
  formatEvent,
  formatEntityType,
  formatState,
  formatTimestamp,
  formatActor,
} from "../utils";

interface ActivityLogColumnCallbacks {
  onViewDetails: (log: ActivityLogRow) => void;
  onRemove: (log: ActivityLogRow) => void;
}

export function createActivityLogColumns(
  callbacks: ActivityLogColumnCallbacks,
): ColumnDef<ActivityLogRow, any>[] {
  function getRowActions(row: ActivityLogRow): RowAction[] {
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
      accessorKey: "actor",
      header: "Actor",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          {/* TODO: no actor avatar in the API response */}
          {/* <img
            src={avatarPlaceholder}
            alt=""
            className="w-8 h-8 rounded-full object-cover"
          /> */}
          {/* TODO: actor is a bare id — no name until the API populates it */}
          <p
            title={row.original.actor}
            className="font-medium text-brand-gray-dark dark:text-gray-100 max-w-40 truncate"
          >
            {formatActor(row.original.actor)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "event",
      header: "Action",
      cell: ({ row }) => formatEvent(row.original.event),
    },
    {
      accessorKey: "entityType",
      header: "Target",
      cell: ({ row }) => (
        <span
          title={row.original.entityId}
          className="text-brand-gray-dark dark:text-gray-300"
        >
          {formatEntityType(row.original.entityType)}
        </span>
      ),
    },
    {
      id: "change",
      header: "Change",
      cell: ({ row }) => {
        const { oldState, newState } = row.original;
        if (!oldState && !newState)
          return <span className="text-brand-gray-light">—</span>;
        return (
          <span className="text-brand-gray-dark dark:text-gray-300">
            {oldState ? `${formatState(oldState)} → ` : ""}
            {formatState(newState)}
          </span>
        );
      },
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
      cell: ({ row }) =>
        row.original.ipAddress ? (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#F2F4F7] dark:bg-gray-800 text-xs font-medium text-brand-gray-dark dark:text-gray-300">
            {row.original.ipAddress}
          </span>
        ) : (
          <span className="text-brand-gray-light">—</span>
        ),
    },
    {
      accessorKey: "createdAt",
      header: "Timestamp",
      cell: ({ row }) => formatTimestamp(row.original.createdAt),
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