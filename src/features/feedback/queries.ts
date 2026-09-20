import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFeedbackAnalytics,
  getFeedbackById,
  getFeedbackList,
  getFeedbackRecentAttention,
  updateFeedbackStatus,
} from "./api";
import type {
  FeedbackAnalyticsParams,
  FeedbackListParams,
  FeedbackStatusUpdatePayload,
} from "./types";

export const useFeedbackAnalytics = (params: FeedbackAnalyticsParams) => {
  const isIncompleteCustom =
    params.period === "custom" && (!params.startDate || !params.endDate);

  return useQuery({
    queryKey: ["feedback", "analytics", params],
    queryFn: () => getFeedbackAnalytics(params),
    enabled: !isIncompleteCustom,
    select: (res) => res.data,
  });
};

export const useFeedbackRecentAttention = () => {
  return useQuery({
    queryKey: ["feedback", "recent-attention"],
    queryFn: getFeedbackRecentAttention,
    select: (res) => res.data,
  });
};

export const useFeedbackList = (params: FeedbackListParams) => {
  return useQuery({
    queryKey: ["feedback", "list", params],
    queryFn: () => getFeedbackList(params),
    select: (res) => res.data,
  });
};

export const useFeedback = (feedbackId: string | undefined) => {
  return useQuery({
    queryKey: ["feedback", "detail", feedbackId],
    queryFn: () => getFeedbackById(feedbackId as string),
    enabled: !!feedbackId,
    select: (res) => res.data,
  });
};

export const useUpdateFeedbackStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      feedbackId,
      payload,
    }: {
      feedbackId: string;
      payload: FeedbackStatusUpdatePayload;
    }) => updateFeedbackStatus(feedbackId, payload),
    onSuccess: (_data, { feedbackId }) => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", "detail", feedbackId] });
    },
  });
};
