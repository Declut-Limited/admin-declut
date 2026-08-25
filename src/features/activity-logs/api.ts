import { api } from "@/lib/api/client";
import type {
  ActivityLogsListParams,
  ActivityLogsListResponse,
  ActivityLogDetailResponse,
} from "./types";

export const getActivityLogs = async (
  params: ActivityLogsListParams,
): Promise<ActivityLogsListResponse> => {
  const { data } = await api.get("/admin/activity-log", { params });
  return data;
};

export const getActivityLogById = async (
  logId: string,
): Promise<ActivityLogDetailResponse> => {
  const { data } = await api.get(`/admin/activity-log/${logId}`);
  return data;
};