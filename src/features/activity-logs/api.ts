import { api } from "@/lib/api/client";
import type {
  ActivityLogsListParams,
  ActivityLogsListResponse,
  ActivityLogDetailResponse,
} from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

export const deleteActivityLog = async (logId: string) => {
  const { data } = await api.delete(`/admin/activity-log/${logId}`);
  return data;
};

export const useDeleteActivityLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => deleteActivityLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
};

export const exportActivityLogs = async (
  params: Omit<ActivityLogsListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/activity-log/export", {
    params,
    responseType: "blob",
  });
  return data;
};