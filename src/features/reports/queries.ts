import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReports,
  getReportBySlug,
  updateReportStatus,
  releaseReport,
  refundReport,
  delistAndRefundReport,
  exportReports,
} from "./api";
import type {
  ReportsListParams,
  ResolveReportPayload,
  UpdateReportStatusPayload,
} from "./types";

export const useReports = (params: ReportsListParams) => {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => getReports(params),
    select: (res) => res.data,
  });
};

export const useReport = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["reports", "detail", slug],
    queryFn: () => getReportBySlug(slug as string),
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
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

const useResolveReportMutation = (
  mutationFn: (reportId: string, payload: ResolveReportPayload) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reportId,
      payload,
    }: {
      reportId: string;
      payload: ResolveReportPayload;
    }) => mutationFn(reportId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

/** Side with the seller — escrow is released back to them, report closed.
 * Unlike refund/delist-and-refund, this endpoint takes no body. */
export const useReleaseReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId }: { reportId: string }) => releaseReport(reportId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

/** Uphold the report — escrow is refunded to the buyer, listing stays up. */
export const useRefundReport = () => useResolveReportMutation(refundReport);

/** Uphold the report — buyer refunded and the listing is taken down. */
export const useDelistAndRefundReport = () =>
  useResolveReportMutation(delistAndRefundReport);

export const useExportReports = () => {
  return useMutation({
    mutationFn: (params: Omit<ReportsListParams, "page" | "limit">) =>
      exportReports(params),
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
