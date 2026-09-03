import { api } from "@/lib/api/client";
import type {
  RolesListResponse,
  CreateRolePayload,
  UpdateRolePayload,
  SettingsResponse,
  GeneralSettings,
  PaymentsSettings,
  FeesCommissionSettings,
} from "./types";

export const getRoles = async (): Promise<RolesListResponse> => {
  const { data } = await api.get("/admin/roles", { params: { limit: 100 } });
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

export const getSettings = async (): Promise<SettingsResponse> => {
  const { data } = await api.get("/admin/settings");
  return data;
};

export const updateGeneralSettings = async (payload: GeneralSettings) => {
  const { data } = await api.patch("/admin/settings/general", payload);
  return data;
};

export const updatePaymentsSettings = async (payload: PaymentsSettings) => {
  const { data } = await api.patch("/admin/settings/payments", payload);
  return data;
};

export const updateFeesCommissionSettings = async (
  payload: FeesCommissionSettings,
) => {
  const { data } = await api.patch(
    "/admin/settings/fees-and-commission",
    payload,
  );
  return data;
};