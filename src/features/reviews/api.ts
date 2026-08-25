import { api } from "@/lib/api/client";
import type { ReviewsListParams, ReviewsListResponse } from "./types";

export const getReviews = async (
  params: ReviewsListParams,
): Promise<ReviewsListResponse> => {
  const { data } = await api.get("/admin/reviews", { params });
  return data;
};

export const deleteReview = async (reviewId: string) => {
  const { data } = await api.delete(`/admin/reviews/${reviewId}`);
  return data;
};

export const resolveReview = async (reviewId: string) => {
  const { data } = await api.patch(`/admin/reviews/${reviewId}/resolve`);
  return data;
};

export const flagReview = async (reviewId: string) => {
  const { data } = await api.patch(`/admin/reviews/${reviewId}/flag`);
  return data;
};