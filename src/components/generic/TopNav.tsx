import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import { FiSearch, FiBell } from "react-icons/fi";
import ProfileDropdown from "./ProfileDropdown";
import { useLogout, useMe } from "@/features/auth/queries";
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { searchIndex, type SearchableItem } from "@/lib/search/searchIndex";

interface TopNavProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function TopNav({ onToggleCollapse, collapsed }: TopNavProps) {
  const { data: me, isLoading } = useMe();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  function normalizeRole(role: string) {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function handleSelect(item: SearchableItem) {
    if (item.tab) {
      navigate({
        pathname: item.path,
        search: `?${new URLSearchParams({ tab: item.tab }).toString()}`,
      });
    } else {
      navigate(item.path);
    }
    setQuery("");
    setOpen(false);
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

      <div className="flex-1 max-w-md relative" ref={searchRef}>
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gray-dark w-4 h-4" />
        <input
          type="text"
          placeholder="Search declut..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query && setOpen(true)}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-brand-gray-light dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {open && query && (
          <div className="global-search-dropdown">
            {results.length === 0 ? (
              <p className="global-search-empty">No matches found</p>
            ) : (
              results.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleSelect(item)}
                  className="global-search-result"
                >
                  {typeof item.icon === "string" ? (
                    <img src={item.icon} alt="" className="w-4 h-4 shrink-0" />
                  ) : item.icon ? (
                    <item.icon className="w-4 h-4 shrink-0 text-brand-gray-light" />
                  ) : null}
                  <span>{item.label}</span>
                  <span className="global-search-result-group">
                    {item.group}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
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
