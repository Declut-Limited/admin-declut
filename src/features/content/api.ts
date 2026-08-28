import { api } from "@/lib/api/client";
import type {
  ContentListParams,
  ContentListResponse,
  ContentDetailResponse,
  CreateContentPayload,
  UpdateContentPayload,
} from "./types";

export const getContentList = async (
  params: ContentListParams,
): Promise<ContentListResponse> => {
  const { data } = await api.get("/admin/content", { params });
  return data;
};

export const getContentBySlug = async (
  slug: string,
): Promise<ContentDetailResponse> => {
  const { data } = await api.get(`/admin/content/slug/${slug}`);
  return data;
};

export const createContent = async (payload: CreateContentPayload) => {
  const { data } = await api.post("/admin/content", payload);
  return data;
};

export const updateContent = async (
  contentId: string,
  payload: UpdateContentPayload,
) => {
  const { data } = await api.patch(`/admin/content/${contentId}`, payload);
  return data;
};

export const deleteContent = async (contentId: string) => {
  const { data } = await api.delete(`/admin/content/${contentId}`);
  return data;
};

export const exportContent = async (
  params: Omit<ContentListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/content/export", {
    params,
    responseType: "blob",
  });
  return data;
};