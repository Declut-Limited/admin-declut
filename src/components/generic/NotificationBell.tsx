import { useState, useRef, useEffect, useMemo } from "react";
import { FiBell, FiCheck } from "react-icons/fi";
import Skeleton from "@/components/generic/Skeleton";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import {
  useAdminNotifications,
  useMarkNotificationRead,
} from "@/features/notifications/queries";
import { useNotificationSocket } from "@/features/notifications/hooks";

const TABS = ["Unread", "Read"] as const;
type NotificationTab = (typeof TABS)[number];

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>("Unread");
  const ref = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useAdminNotifications();
  const { mutate: markRead, isPending: isMarking } = useMarkNotificationRead();
  const { connected } = useNotificationSocket();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = useMemo(() => data?.results ?? [], [data?.results]);
  const unreadCount = data?.unreadCount ?? 0;

  // the endpoint has no read filter — splitting the fetched page client-side
  const visibleNotifications = useMemo(
    () =>
      notifications.filter((n) =>
        activeTab === "Unread" ? !n.read : n.read,
      ),
    [notifications, activeTab],
  );

  const readCount = notifications.length - notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        aria-label="Notifications"
      >
        <FiBell className="w-5 h-5 text-[#454545] dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {!connected && (
          <span className="notification-offline-dot" title="Reconnecting…" />
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
              Notifications
            </p>
            {unreadCount > 0 && (
              <span className="text-xs text-brand-gray-light">
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="notification-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`notification-tab ${
                  activeTab === tab ? "notification-tab-active" : ""
                }`}
              >
                {tab}
                <span className="notification-tab-count">
                  {tab === "Unread" ? unreadCount : readCount}
                </span>
              </button>
            ))}
          </div>

          <div className="notification-dropdown-body">
            {isError ? (
              <p className="notification-empty">
                {getApiErrorMessage(error, "Couldn't load notifications.")}
              </p>
            ) : isLoading ? (
              <div className="flex flex-col gap-3 p-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-3.5 w-40 mb-1.5" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : visibleNotifications.length === 0 ? (
              <p className="notification-empty">
                {activeTab === "Unread"
                  ? "You're all caught up."
                  : "No read notifications."}
              </p>
            ) : (
              visibleNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-row ${
                    notification.read ? "" : "notification-row-unread"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!notification.read && (
                      <span className="notification-unread-dot" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="notification-row-title">
                        {notification.title}
                      </p>
                      <p className="notification-row-body">
                        {notification.body}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="notification-row-time">
                          {formatTimestamp(notification.createdAt)}
                        </p>

                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() => markRead(notification._id)}
                            disabled={isMarking}
                            className="notification-mark-read"
                          >
                            <FiCheck className="w-3 h-3" />
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}