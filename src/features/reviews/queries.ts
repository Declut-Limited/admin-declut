import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, deleteReview, resolveReview, flagReview } from "./api";
import type { ReviewsListParams } from "./types";

export const useReviews = (params: ReviewsListParams) => {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => getReviews(params),
    select: (res) => res.data,
    placeholderData: (previous) => previous,
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => deleteReview(reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
};

export const useResolveReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => resolveReview(reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
};

export const useFlagReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => flagReview(reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reviews"] }),
  });
};