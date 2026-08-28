import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContentList,
  getContentBySlug,
  createContent,
  updateContent,
  deleteContent,
  exportContent,
} from "./api";
import type {
  ContentListParams,
  CreateContentPayload,
  UpdateContentPayload,
} from "./types";

export const useContentList = (params: ContentListParams) => {
  return useQuery({
    queryKey: ["content", params],
    queryFn: () => getContentList(params),
    select: (res) => res.data,
  });
};

export const useContent = (slug: string | undefined) => {
  return useQuery({
    queryKey: ["content", "detail", slug],
    queryFn: () => getContentBySlug(slug as string),
    enabled: !!slug,
    select: (res) => res.data,
  });
};

const useContentMutation = <TVars,>(
  mutationFn: (vars: TVars) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
};

export const useCreateContent = () =>
  useContentMutation((payload: CreateContentPayload) =>
    createContent(payload),
  );

export const useUpdateContent = () =>
  useContentMutation(
    ({
      contentId,
      payload,
    }: {
      contentId: string;
      payload: UpdateContentPayload;
    }) => updateContent(contentId, payload),
  );

export const useDeleteContent = () =>
  useContentMutation((contentId: string) => deleteContent(contentId));

export const useExportContent = () => {
  return useMutation({
    mutationFn: (params: Omit<ContentListParams, "page" | "limit">) =>
      exportContent(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `content-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};