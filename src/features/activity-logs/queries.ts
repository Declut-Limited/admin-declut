import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getActivityLogs, getActivityLogById, deleteActivityLog } from "./api";
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