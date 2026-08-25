import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
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

const MENU_WIDTH = 160; // w-40

export default function RowActionsMenu({
  actions,
  triggerClassName,
}: RowActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = actions.length * 36 + 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < menuHeight && rect.top > menuHeight;

    setPosition({
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: rect.right - MENU_WIDTH,
    });
  }, [open, actions.length]);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleReposition() {
      setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className={
          triggerClassName ??
          "p-1.5 rounded-full border-2 border-brand-gray-dark hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
        }
        aria-label="Row actions"
      >
        <FiMoreHorizontal className="w-4 h-4 text-brand-grborder-brand-gray-dark" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "fixed",
              top: position.top,
              left: position.left,
              width: MENU_WIDTH,
            }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50"
          >
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
          </div>,
          document.body,
        )}
    </div>
  );
}