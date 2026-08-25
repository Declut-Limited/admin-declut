import { api } from "@/lib/api/client";
import type { CategoriesListResponse, CreateCategoryPayload } from "./types";

export const getCategories = async (): Promise<CategoriesListResponse> => {
  const { data } = await api.get("/admin/categories");
  return data;
};

export const createCategory = async (payload: CreateCategoryPayload) => {
  const { data } = await api.post("/admin/categories", payload);
  return data;
};

export const toggleCategoryStatus = async (categoryId: string) => {
  const { data } = await api.patch(`/admin/categories/${categoryId}/toggle`);
  return data;
};

export const exportCategories = async (): Promise<Blob> => {
  const { data } = await api.get("/admin/categories/export", {
    responseType: "blob",
  });
  return data;
};