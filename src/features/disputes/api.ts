import { api } from "@/lib/api/client";
import type {
  DisputesListParams,
  DisputesListResponse,
  DisputeDetailResponse,
  UpdateReportStatusPayload,
} from "./types";

export const getDisputes = async (
  params: DisputesListParams,
): Promise<DisputesListResponse> => {
  const { data } = await api.get("/admin/reports", { params });
  return data;
};

export const getDisputeBySlug = async (
  slug: string,
): Promise<DisputeDetailResponse> => {
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

export const exportDisputes = async (
  params: Omit<DisputesListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/reports/export", {
    params,
    responseType: "blob",
  });
  return data;
};