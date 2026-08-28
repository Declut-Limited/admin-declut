import { api } from "@/lib/api/client";
import type {
  AdminNotificationsResponse,
  NotificationsListParams,
  NotificationsListResponse,
} from "./types";

export const getNotifications = async (
  params: NotificationsListParams,
): Promise<NotificationsListResponse> => {
  const { data } = await api.get("/admin/notification-broadcasts", { params });
  return data;
};

export const getAdminNotifications = async (params: {
  page?: number;
  limit?: number;
}): Promise<AdminNotificationsResponse> => {
  const { data } = await api.get("/admin/notifications", { params });
  return data;
};

export const markNotificationRead = async (notificationId: string) => {
  const { data } = await api.patch(
    `/admin/notifications/${notificationId}/read`,
  );
  return data;
};