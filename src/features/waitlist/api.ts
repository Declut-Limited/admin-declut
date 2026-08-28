import { api } from "@/lib/api/client";
import type {
  WaitlistInsightsResponse,
  WaitlistListParams,
  WaitlistListResponse,
  InviteUserPayload,
  BulkInvitePayload,
} from "./types";

export const getWaitlistInsights =
  async (): Promise<WaitlistInsightsResponse> => {
    const { data } = await api.get("/admin/waitlist/insights");
    return data;
  };

export const getWaitlist = async (
  params: WaitlistListParams,
): Promise<WaitlistListResponse> => {
  const { data } = await api.get("/admin/waitlist", { params });
  return data;
};

export const getUninvitedWaitlist = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<WaitlistListResponse> => {
  const { data } = await api.get("/admin/waitlist/uninvited", { params });
  return data;
};

export const removeWaitlistUser = async (waitlistId: string) => {
  const { data } = await api.delete(`/admin/waitlist/${waitlistId}`);
  return data;
};

export const inviteWaitlistUser = async (
  waitlistId: string,
  payload: InviteUserPayload,
) => {
  const { data } = await api.post(
    `/admin/waitlist/${waitlistId}/invite`,
    payload,
  );
  return data;
};

export const bulkInviteWaitlist = async (payload: BulkInvitePayload) => {
  const { data } = await api.post("/admin/waitlist/bulk-invite", payload);
  return data;
};

export const exportWaitlist = async (
  params: Omit<WaitlistListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/waitlist/export", {
    params,
    responseType: "blob",
  });
  return data;
};