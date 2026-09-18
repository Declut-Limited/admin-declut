import { api } from "@/lib/api/client";
import type {
  ReportsListParams,
  ReportsListResponse,
  ReportDetailResponse,
  UpdateReportStatusPayload,
  ResolveReportPayload,
} from "./types";

export const getReports = async (
  params: ReportsListParams,
): Promise<ReportsListResponse> => {
  const { data } = await api.get("/admin/reports", { params });
  return data;
};

export const getReportBySlug = async (
  slug: string,
): Promise<ReportDetailResponse> => {
  const { data } = await api.get(`/admin/reports/${slug}`);
  return data;
};

export const updateReportStatus = async (
  reportId: string,
  payload: UpdateReportStatusPayload,
) => {
  const { data } = await api.patch(`/admin/reports/${reportId}/status`, payload);
  return data;
};

export const releaseReport = async (reportId: string) => {
  const { data } = await api.post(`/admin/reports/${reportId}/resolve/release`);
  return data;
};

export const refundReport = async (
  reportId: string,
  payload: ResolveReportPayload,
) => {
  const { data } = await api.post(
    `/admin/reports/${reportId}/resolve/refund`,
    payload,
  );
  return data;
};

export const delistAndRefundReport = async (
  reportId: string,
  payload: ResolveReportPayload,
) => {
  const { data } = await api.post(
    `/admin/reports/${reportId}/resolve/delist-and-refund`,
    payload,
  );
  return data;
};

export const exportReports = async (
  params: Omit<ReportsListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/reports/export", {
    params,
    responseType: "blob",
  });
  return data;
};
