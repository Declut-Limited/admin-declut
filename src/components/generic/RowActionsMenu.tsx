import { useState, useRef, useEffect } from "react";
import { FiMoreHorizontal } from "react-icons/fi";

export interface RowAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "danger" | "success";
  dividerAfter?: boolean;
}

interface RowActionsMenuProps {
  actions: RowAction[];
  triggerClassName?: string;
}

const variantClass: Record<NonNullable<RowAction["variant"]>, string> = {
  default: "text-[#475467] dark:text-gray-200",
  danger: "text-[#F04438]",
  success: "text-[#12B76A]",
};

export default function RowActionsMenu({
  actions,
  triggerClassName,
}: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={
          triggerClassName ??
          "p-1.5 rounded-full border-2 border-brand-gray-dark hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        }
        aria-label="Row actions"
      >
        <FiMoreHorizontal className="w-4 h-4 text-brand-grborder-brand-gray-dark" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
          {actions.map((action) => (
            <div key={action.label}>
              <button
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer ${variantClass[action.variant ?? "default"]}`}
              >
                {action.icon}
                {action.label}
              </button>
              {action.dividerAfter && (
                <div className="border-b border-gray-100 dark:border-gray-800 my-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
