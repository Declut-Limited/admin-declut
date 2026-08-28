import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminNotifications, getNotifications, markNotificationRead } from "./api";
import type { NotificationsListParams } from "./types";

export const useNotifications = (params: NotificationsListParams) => {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    select: (res) => res.data,
  });
};

export const ADMIN_NOTIFICATIONS_KEY = ["admin-notifications"] as const;

export const useAdminNotifications = () => {
  return useQuery({
    queryKey: ADMIN_NOTIFICATIONS_KEY,
    queryFn: () => getAdminNotifications({ page: 1, limit: 20 }),
    select: (res) => res.data,
    enabled: Boolean(localStorage.getItem("access_token")),
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_NOTIFICATIONS_KEY });
    },
  });
};