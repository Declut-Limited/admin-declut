import { FiInbox } from "react-icons/fi";
import type { ReactNode } from "react";

interface EmptyTableStateProps {
  icon?: ReactNode;
  message?: string;
  colSpan: number;
}

export default function EmptyTableState({
  icon,
  message = "No results found.",
  colSpan,
}: EmptyTableStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-16">
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500">
            {icon ?? <FiInbox className="w-5 h-5" />}
          </span>
          <p className="text-sm text-brand-gray-light">{message}</p>
        </div>
      </td>
    </tr>
  );
}