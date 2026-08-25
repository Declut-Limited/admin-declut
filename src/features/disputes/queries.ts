import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDisputes, getDisputeBySlug, updateReportStatus } from "./api";
import type { DisputesListParams, UpdateReportStatusPayload } from "./types";

export const useDisputes = (params: DisputesListParams) => {
  return useQuery({
    queryKey: ["disputes", params],
    queryFn: () => getDisputes(params),
    select: (res) => res.data,
    placeholderData: (previous) => previous,
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