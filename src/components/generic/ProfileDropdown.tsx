import { useState, useRef, useEffect } from "react";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { useTheme } from "@/lib/theme/useTheme";
import { IoIosArrowDown } from "react-icons/io";
import Skeleton from "./Skeleton";

interface ProfileDropdownProps {
  name: string;
  role: string;
  email: string;
  isLoading?: boolean;
  onLogout: () => void;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function Avatar({ name, size }: { name: string; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #D19E00, #2563EB)",
      }}
      className="rounded-full text-white flex items-center justify-center font-semibold shrink-0"
    >
      <span style={{ fontSize: size * 0.4 }}>{getInitials(name)}</span>
    </div>
  );
}

export default function ProfileDropdown({
  name,
  role,
  email,
  isLoading,
  onLogout,
}: ProfileDropdownProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="hidden sm:block">
          <Skeleton className="h-3.5 w-20 mb-1.5" />
          <Skeleton className="h-3 w-14" />
        </div>
      </div>
    );
  }
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
      >
        <Avatar name={name} size={32} />
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-[#454545] dark:text-gray-100 tracking-wide">
            {name}
          </p>
          <p className="text-xs text-[#16A34A] tracking-wide">{role}</p>
        </div>
        <IoIosArrowDown size={16} color="#454545" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-[#FAFAFA] dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-999">
          <div className="flex items-center gap-3 pb-3">
            <Avatar name={name} size={40} />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{role}</p>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950 rounded-lg px-3 py-2 mb-3">
            <p className="text-[10px] uppercase text-gray-400 dark:text-gray-500">
              email
            </p>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
              {email}
            </p>
          </div>

          <div className="space-y-1 mb-4">
            <button className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiUser className="w-4 h-4" /> My Profile
            </button>
            <button className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiSettings className="w-4 h-4" /> Settings
            </button>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#454545] dark:text-gray-500 uppercase tracking-wide mb-2">
              Appearance
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["light", "dark", "system"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`rounded-lg border p-2 flex flex-col justify-between h-20 text-left transition-colors ${
                    theme === mode
                      ? "border-indigo-500 ring-1 ring-indigo-500"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className="text-xs text-[#888888] dark:text-gray-500 capitalize">
                    {mode}
                  </span>

                  {mode === "system" ? (
                    <div className="flex rounded-md overflow-hidden h-7">
                      <span className="flex-1 flex items-center justify-center bg-gray-900 text-white text-xs font-medium">
                        Aa
                      </span>
                      <span className="flex-1 flex items-center justify-center bg-white text-gray-400 text-xs font-medium">
                        Aa
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`flex items-center justify-center rounded-md h-7 text-xs font-medium ${
                        mode === "dark"
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-900"
                      }`}
                    >
                      Aa
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
          >
            <FiLogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
