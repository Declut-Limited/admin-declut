import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActivityLogs, getActivityLogById, deleteActivityLog, exportActivityLogs } from "./api";
import type { ActivityLogsListParams } from "./types";

export const useActivityLogs = (params: ActivityLogsListParams) => {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => getActivityLogs(params),
    select: (res) => res.data,
  });
};

export const useActivityLog = (logId: string | undefined) => {
  return useQuery({
    queryKey: ["activity-logs", "detail", logId],
    queryFn: () => getActivityLogById(logId as string),
    enabled: !!logId,
    select: (res) => res.data,
  });
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

export const useExportActivityLogs = () => {
  return useMutation({
    mutationFn: (params: Omit<ActivityLogsListParams, "page" | "limit">) =>
      exportActivityLogs(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};