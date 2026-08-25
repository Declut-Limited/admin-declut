/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import EmptyTableState from "./EmptyTableState";
import TableLoadingState from "./TableLoadingState";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading?: boolean;
  loadingRows?: number;
  emptyIcon?: React.ReactNode;
  emptyMessage?: string;
}

export default function DataTable<TData>({
  data,
  columns,
  isLoading,
  loadingRows = 5,
  emptyIcon,
  emptyMessage,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-left px-4 py-3 text-xs font-semibold text-brand-gray-dark dark:text-gray-400 uppercase tracking-wide whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <TableLoadingState colSpan={columns.length} rows={loadingRows} />
          ) : data.length === 0 ? (
            <EmptyTableState
              colSpan={columns.length}
              icon={emptyIcon}
              message={emptyMessage}
            />
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 text-brand-gray-dark dark:text-gray-400 dark:hover:bg-gray-800/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
