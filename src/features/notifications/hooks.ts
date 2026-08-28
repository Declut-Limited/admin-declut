import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { ADMIN_NOTIFICATIONS_KEY } from "./queries";
import type { AdminNotification, AdminNotificationsResponse } from "./types";

// VITE_BASE_URL includes /api; the socket namespace sits at the root
const SOCKET_URL = `${import.meta.env.VITE_BASE_URL.replace(/\/api\/?$/, "")}/admin-notifications`;

export function useNotificationSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("notification", (notification: AdminNotification) => {
      queryClient.setQueryData<AdminNotificationsResponse>(
        ADMIN_NOTIFICATIONS_KEY,
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            data: {
              ...prev.data,
              results: [notification, ...prev.data.results],
              total: prev.data.total + 1,
              unreadCount: prev.data.unreadCount + 1,
            },
          };
        },
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  return { connected };
}