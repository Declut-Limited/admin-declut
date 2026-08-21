import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { FiSearch, FiBell } from "react-icons/fi";
import ProfileDropdown from "./ProfileDropdown";
import { useLogout, useMe } from "@/features/auth/queries";

interface TopNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function TopNav({ onToggleCollapse, collapsed }: TopNavProps) {
  const { data: me, isLoading } = useMe();
  const { mutate: logout } = useLogout();

  function normalizeRole(role: string) {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <header className="h-16 flex items-center gap-4 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0">
      <button
        onClick={onToggleCollapse}
        className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
        aria-label="Toggle sidebar"
      >
        {collapsed ? (
          <TbLayoutSidebarRightCollapse size={24} color="#454545" />
        ) : (
          <TbLayoutSidebarLeftCollapse size={24} color="#454545" />
        )}
      </button>

      <div className="flex-1 max-w-md relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-dark w-4 h-4" />
        <input
          type="text"
          placeholder="Search users, listings, transactions..."
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-[#667085] dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <ProfileDropdown
          name={me?.name ?? "-"}
          role={normalizeRole(me?.role ?? "")}
          email={me?.email ?? ""}
          isLoading={isLoading}
          onLogout={() => logout()}
        />

        <button
          className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Notifications"
        >
          <FiBell className="w-5 h-5 text-[#454545] dark:text-gray-300" />
        </button>
      </div>
    </header>
  );
}
