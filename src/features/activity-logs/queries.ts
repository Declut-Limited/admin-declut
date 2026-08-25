import { useQuery } from "@tanstack/react-query";
import { getActivityLogs, getActivityLogById } from "./api";
import type { ActivityLogsListParams } from "./types";

export const useActivityLogs = (params: ActivityLogsListParams) => {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => getActivityLogs(params),
    select: (res) => res.data,
    placeholderData: (previous) => previous,
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