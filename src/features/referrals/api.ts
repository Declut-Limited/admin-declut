import { api } from "@/lib/api/client";
import type {
  BulkMarkRewardsPaidPayload,
  ReferralAnalyticsParams,
  ReferralAnalyticsResponse,
  ReferralCampaignPayload,
  ReferralCampaignResponse,
  ReferralCampaignsListParams,
  ReferralCampaignsListResponse,
  ReferralDashboardParams,
  ReferralDashboardResponse,
  ReferralParticipantDetailParams,
  ReferralParticipantResponse,
  ReferralParticipantsListParams,
  ReferralParticipantsListResponse,
  ReferralRewardsListParams,
  ReferralRewardsListResponse,
} from "./types";

export const getReferralCampaigns = async (
  params: ReferralCampaignsListParams,
): Promise<ReferralCampaignsListResponse> => {
  const { data } = await api.get("/admin/referral-campaigns", { params });
  return data;
};

export const getReferralCampaign = async (
  campaignId: string,
): Promise<ReferralCampaignResponse> => {
  const { data } = await api.get(`/admin/referral-campaigns/${campaignId}`);
  return data;
};

export const createReferralCampaign = async (
  payload: ReferralCampaignPayload,
): Promise<ReferralCampaignResponse> => {
  const { data } = await api.post("/admin/referral-campaigns", payload);
  return data;
};

export const updateReferralCampaign = async (
  campaignId: string,
  payload: ReferralCampaignPayload,
): Promise<ReferralCampaignResponse> => {
  const { data } = await api.patch(
    `/admin/referral-campaigns/${campaignId}`,
    payload,
  );
  return data;
};

export const getReferralParticipants = async (
  params: ReferralParticipantsListParams,
): Promise<ReferralParticipantsListResponse> => {
  const { data } = await api.get("/admin/referral-participants", { params });
  return data;
};

export const getReferralParticipant = async (
  participantId: string,
  params?: ReferralParticipantDetailParams,
): Promise<ReferralParticipantResponse> => {
  const { data } = await api.get(
    `/admin/referral-participants/${participantId}`,
    { params },
  );
  return data;
};

export const getReferralDashboard = async (
  params?: ReferralDashboardParams,
): Promise<ReferralDashboardResponse> => {
  const { data } = await api.get("/admin/referral-campaigns/dashboard", {
    params,
  });
  return data;
};

export const getReferralAnalytics = async (
  params?: ReferralAnalyticsParams,
): Promise<ReferralAnalyticsResponse> => {
  const { data } = await api.get("/admin/referral-campaigns/analytics", {
    params,
  });
  return data;
};

export const getReferralRewards = async (
  params: ReferralRewardsListParams,
): Promise<ReferralRewardsListResponse> => {
  const { data } = await api.get("/admin/referral-rewards", { params });
  return data;
};

export const duplicateReferralCampaign = async (
  campaignId: string,
): Promise<ReferralCampaignResponse> => {
  const { data } = await api.post(
    `/admin/referral-campaigns/${campaignId}/duplicate`,
  );
  return data;
};

export const archiveReferralCampaign = async (
  campaignId: string,
): Promise<ReferralCampaignResponse> => {
  const { data } = await api.patch(
    `/admin/referral-campaigns/${campaignId}/archive`,
  );
  return data;
};

export const exportReferralCampaigns = async (
  params: Omit<ReferralCampaignsListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/referral-campaigns/export", {
    params,
    responseType: "blob",
  });
  return data;
};

export const exportReferralParticipants = async (
  params: Omit<ReferralParticipantsListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/referral-participants/export", {
    params,
    responseType: "blob",
  });
  return data;
};

export const exportReferralRewards = async (
  params: Omit<ReferralRewardsListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/referral-rewards/export", {
    params,
    responseType: "blob",
  });
  return data;
};

export const bulkMarkRewardsPaid = async (
  payload: BulkMarkRewardsPaidPayload,
): Promise<{ success: boolean }> => {
  const { data } = await api.post(
    "/admin/referral-rewards/bulk-mark-paid",
    payload,
  );
  return data;
};

export const markRewardPaid = async (
  rewardId: string,
): Promise<{ success: boolean }> => {
  const { data } = await api.patch(
    `/admin/referral-rewards/${rewardId}/mark-paid`,
  );
  return data;
};
