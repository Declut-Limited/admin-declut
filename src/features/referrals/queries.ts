import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReferralCampaigns,
  getReferralCampaign,
  createReferralCampaign,
  updateReferralCampaign,
  getReferralParticipants,
  getReferralParticipant,
  getReferralDashboard,
  getReferralAnalytics,
  getReferralRewards,
  duplicateReferralCampaign,
  archiveReferralCampaign,
  exportReferralCampaigns,
  exportReferralParticipants,
  exportReferralRewards,
  bulkMarkRewardsPaid,
  markRewardPaid,
} from "./api";
import type {
  BulkMarkRewardsPaidPayload,
  ReferralAnalyticsParams,
  ReferralCampaignPayload,
  ReferralCampaignsListParams,
  ReferralDashboardParams,
  ReferralParticipantDetailParams,
  ReferralParticipantsListParams,
  ReferralRewardsListParams,
} from "./types";

export const useReferralCampaigns = (params: ReferralCampaignsListParams) => {
  return useQuery({
    queryKey: ["referral-campaigns", params],
    queryFn: () => getReferralCampaigns(params),
    select: (res) => res.data,
  });
};

export const useReferralCampaign = (campaignId: string | undefined) => {
  return useQuery({
    queryKey: ["referral-campaigns", campaignId],
    queryFn: () => getReferralCampaign(campaignId as string),
    select: (res) => res.data,
    enabled: Boolean(campaignId),
  });
};

export const useCreateReferralCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReferralCampaignPayload) =>
      createReferralCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-campaigns"] });
    },
  });
};

export const useUpdateReferralCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      campaignId,
      payload,
    }: {
      campaignId: string;
      payload: ReferralCampaignPayload;
    }) => updateReferralCampaign(campaignId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-campaigns"] });
    },
  });
};

export const useReferralParticipants = (
  params: ReferralParticipantsListParams,
) => {
  return useQuery({
    queryKey: ["referral-participants", params],
    queryFn: () => getReferralParticipants(params),
    select: (res) => res.data,
  });
};

export const useReferralParticipant = (
  participantId: string | undefined,
  params?: ReferralParticipantDetailParams,
) => {
  return useQuery({
    queryKey: ["referral-participants", participantId, params],
    queryFn: () => getReferralParticipant(participantId as string, params),
    select: (res) => res.data,
    enabled: Boolean(participantId),
  });
};

export const useReferralDashboard = (params?: ReferralDashboardParams) => {
  return useQuery({
    queryKey: ["referral-dashboard", params],
    queryFn: () => getReferralDashboard(params),
    select: (res) => res.data,
  });
};

export const useReferralAnalytics = (params?: ReferralAnalyticsParams) => {
  return useQuery({
    queryKey: ["referral-analytics", params],
    queryFn: () => getReferralAnalytics(params),
    select: (res) => res.data,
  });
};

export const useReferralRewards = (params: ReferralRewardsListParams) => {
  return useQuery({
    queryKey: ["referral-rewards", params],
    queryFn: () => getReferralRewards(params),
    select: (res) => res.data,
  });
};

export const useDuplicateReferralCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => duplicateReferralCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-campaigns"] });
    },
  });
};

export const useArchiveReferralCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (campaignId: string) => archiveReferralCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-campaigns"] });
    },
  });
};

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const useExportReferralCampaigns = () => {
  return useMutation({
    mutationFn: (params: Omit<ReferralCampaignsListParams, "page" | "limit">) =>
      exportReferralCampaigns(params),
    onSuccess: (blob) =>
      downloadBlob(
        blob,
        `referral-campaigns-${new Date().toISOString().split("T")[0]}.csv`,
      ),
  });
};

export const useExportReferralParticipants = () => {
  return useMutation({
    mutationFn: (
      params: Omit<ReferralParticipantsListParams, "page" | "limit">,
    ) => exportReferralParticipants(params),
    onSuccess: (blob) =>
      downloadBlob(
        blob,
        `referral-participants-${new Date().toISOString().split("T")[0]}.csv`,
      ),
  });
};

export const useExportReferralRewards = () => {
  return useMutation({
    mutationFn: (params: Omit<ReferralRewardsListParams, "page" | "limit">) =>
      exportReferralRewards(params),
    onSuccess: (blob) =>
      downloadBlob(
        blob,
        `referral-rewards-${new Date().toISOString().split("T")[0]}.csv`,
      ),
  });
};

export const useBulkMarkRewardsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BulkMarkRewardsPaidPayload) =>
      bulkMarkRewardsPaid(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-rewards"] });
    },
  });
};

export const useMarkRewardPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId: string) => markRewardPaid(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-rewards"] });
    },
  });
};
