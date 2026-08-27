import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDisputes, getDisputeBySlug, updateReportStatus, exportDisputes } from "./api";
import type { DisputesListParams, UpdateReportStatusPayload } from "./types";

export const useDisputes = (params: DisputesListParams) => {
  return useQuery({
    queryKey: ["disputes", params],
    queryFn: () => getDisputes(params),
    select: (res) => res.data,
  });
};

export const useDispute = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["disputes", "detail", slug],
    queryFn: () => getDisputeBySlug(slug as string),
    enabled: !!slug,
    select: (res) => res.data,
  });
};

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: {
      reportId: string;
      payload: UpdateReportStatusPayload;
    }) => updateReportStatus(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
    },
  });
};

export const useExportDisputes = () => {
  return useMutation({
    mutationFn: (params: Omit<DisputesListParams, "page" | "limit">) =>
      exportDisputes(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reports-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};