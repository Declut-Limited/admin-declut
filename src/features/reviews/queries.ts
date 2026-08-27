import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReviews, deleteReview, resolveReview, flagReview, exportReviews } from "./api";
import type { ReviewsListParams } from "./types";

export const useReviews = (params: ReviewsListParams) => {
  return useQuery({
    queryKey: ["reviews", params],
    queryFn: () => getReviews(params),
    select: (res) => res.data,
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

export const useExportReviews = () => {
  return useMutation({
    mutationFn: (params: Omit<ReviewsListParams, "page" | "limit">) =>
      exportReviews(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reviews-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};