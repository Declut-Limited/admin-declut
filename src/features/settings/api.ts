import { api } from "@/lib/api/client";
import type {
  RolesListResponse,
  CreateRolePayload,
  UpdateRolePayload,
} from "./types";

export const getRoles = async (): Promise<RolesListResponse> => {
  const { data } = await api.get("/admin/roles");
  return data;
};

export const createRole = async (payload: CreateRolePayload) => {
  const { data } = await api.post("/admin/roles", payload);
  return data;
};

export const updateRole = async (roleId: string, payload: UpdateRolePayload) => {
  const { data } = await api.patch(`/admin/roles/${roleId}`, payload);
  return data;
};

export const deleteRole = async (roleId: string) => {
  const { data } = await api.delete(`/admin/roles/${roleId}`);
  return data;
};