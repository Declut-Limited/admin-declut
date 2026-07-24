import { NavLink } from "react-router-dom";
import { navGroups } from "./Sidebar.config";
import logo from "@/assets/icons/logo.svg";
import { FiMoreHorizontal } from "react-icons/fi";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside
      className={`h-screen bg-[#1E3A8A] dark:bg-gray-900 text-white flex flex-col transition-all duration-200 ${
        collapsed ? "w-20" : "w-56"
      }`}
    >
      <div className="flex items-center gap-2 px-4 h-16 shrink-0">
        <img
          src={logo}
          alt="Declut logo"
          className="w-7 h-7 shrink-0 object-contain"
        />
        {!collapsed && <span className="font-semibold text-lg tracking-widest">Declut</span>}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-6 py-2">
        {navGroups.map((group) => (
          <div key={group.label} className="sidebar-nav-group">
            {!collapsed && (
              <p className="sidebar-group-label tracking-wider px-2 text-xs font-semibold text-blue-300 uppercase mb-2">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `sidebar-nav-item tracking-wider flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[#FFFFE71A] text-white"
                        : "text-blue-100 hover:bg-[#FFFFE71A]"
                    }`
                  }
                >
                  {typeof item.icon === "string" ? (
                    <img src={item.icon} alt="" className="w-5 h-5 shrink-0" />
                  ) : (
                    <item.icon className="w-5 h-5 shrink-0" />
                  )}
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 px-4 py-3">
        <div className="flex items-center gap-2 border-t border-white/20 pt-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 text-white"
            style={{ background: "linear-gradient(135deg, #FFE60D, #89580A)" }}
          >
            SJ
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Simon James</p>
                <p className="text-xs text-blue-300 truncate">
                  GPD International
                </p>
              </div>
              <button
                className="text-blue-300 hover:text-white shrink-0 cursor-pointer"
                aria-label="User options"
              >
                <FiMoreHorizontal className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
