import { api } from "@/lib/api/client";
import type { CategoriesListParams, CategoriesListResponse, CreateCategoryPayload, UpdateCategoryPayload } from "./types";

export const getCategories = async (
  params: CategoriesListParams,
): Promise<CategoriesListResponse> => {
  const { data } = await api.get("/admin/categories", { params });
  return data;
};

export const exportCategories = async (
  params: Omit<CategoriesListParams, "page" | "limit">,
): Promise<Blob> => {
  const { data } = await api.get("/admin/categories/export", {
    params,
    responseType: "blob",
  });
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


export const updateCategory = async (
  categoryId: string,
  payload: UpdateCategoryPayload,
) => {
  const { data } = await api.patch(`/admin/categories/${categoryId}`, payload);
  return data;
};

export const deleteCategory = async (categoryId: string) => {
  const { data } = await api.delete(`/admin/categories/${categoryId}`);
  return data;
};