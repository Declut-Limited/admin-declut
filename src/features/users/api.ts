import { api } from "@/lib/api/client";
import type { SuspendUserPayload, UpdateKycPayload, UserDetailResponse, UserListingsResponse, UsersListParams, UsersListResponse } from "./types";

export const getUsers = async (params: UsersListParams): Promise<UsersListResponse> => {
  const { data } = await api.get("/admin/users", { params });
  return data;
};

export const exportUsers = async (params: Omit<UsersListParams, "page" | "limit">): Promise<Blob> => {
  const { data } = await api.get("/admin/users/export", {
    params,
    responseType: "blob",
  });
  return data;
};

export const getUserById = async (userId: string): Promise<UserDetailResponse> => {
  const { data } = await api.get(`/admin/users/${userId}`);
  return data;
};

export const suspendUser = async (userId: string, payload: SuspendUserPayload) => {
  const { data } = await api.patch(`/admin/users/${userId}/suspend`, payload);
  return data;
};

export const reactivateUser = async (userId: string) => {
  const { data } = await api.patch(`/admin/users/${userId}/reactivate`);
  return data;
};

export const getListingsByUser = async (
  userId: string,
  params: { page?: number; limit?: number },
): Promise<UserListingsResponse> => {
  const { data } = await api.get(`/admin/listings/by-user/${userId}`, { params });
  return data;
};

export const updateUserKyc = async (userId: string, payload: UpdateKycPayload) => {
  const { data } = await api.patch(`/admin/users/${userId}/kyc`, payload);
  return data;
};