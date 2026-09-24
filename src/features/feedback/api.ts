import { api } from "@/lib/api/client";
import type {
  FeedbackAnalyticsParams,
  FeedbackAnalyticsResponse,
  FeedbackDetailResponse,
  FeedbackListParams,
  FeedbackListResponse,
  FeedbackNoteRecord,
  FeedbackRecentAttentionResponse,
  FeedbackStatusUpdatePayload,
} from "./types";

export const getFeedbackAnalytics = async (
  params: FeedbackAnalyticsParams,
): Promise<FeedbackAnalyticsResponse> => {
  const { data } = await api.get("/admin/feedback/analytics", { params });
  return data;
};

export const getFeedbackRecentAttention =
  async (): Promise<FeedbackRecentAttentionResponse> => {
    const { data } = await api.get("/admin/feedback/recent-attention");
    return data;
  };

export const getFeedbackList = async (
  params: FeedbackListParams,
): Promise<FeedbackListResponse> => {
  const { data } = await api.get("/admin/feedback", { params });
  return data;
};

export const getFeedbackById = async (
  feedbackId: string,
): Promise<FeedbackDetailResponse> => {
  const { data } = await api.get(`/admin/feedback/${feedbackId}`);
  return data;
};

export const updateFeedbackStatus = async (
  feedbackId: string,
  payload: FeedbackStatusUpdatePayload,
): Promise<FeedbackDetailResponse> => {
  const { data } = await api.patch(`/admin/feedback/${feedbackId}/status`, payload);
  return data;
};

export const addFeedbackNote = async (payload: {
  feedbackId: string;
  description: string;
}): Promise<{ success: boolean; data: FeedbackNoteRecord }> => {
  const { data } = await api.post("/admin/feedback-notes", payload);
  return data;
};

export const updateFeedbackNote = async (
  noteId: string,
  description: string,
): Promise<{ success: boolean; data: FeedbackNoteRecord }> => {
  const { data } = await api.patch(`/admin/feedback-notes/${noteId}`, {
    description,
  });
  return data;
};

export const deleteFeedbackNote = async (
  noteId: string,
): Promise<{ success: boolean }> => {
  const { data } = await api.delete(`/admin/feedback-notes/${noteId}`);
  return data;
};
