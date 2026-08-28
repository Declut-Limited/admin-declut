import { api } from "@/lib/api/client";
import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  LoginPayload,
  LoginResponse,
  LogoutPayload,
  LogoutResponse,
  MeResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  VerifyResetTokenResponse,
} from "./types";
import type { DashboardPreferences, UpdateProfileGeneralPayload } from "../profile/types";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post("/admin/auth/login", payload);
  return data;
};

export const logout = async (
  payload: LogoutPayload,
): Promise<LogoutResponse> => {
  const { data } = await api.post("/admin/auth/logout", payload);
  return data;
};

export const getMe = async (): Promise<MeResponse> => {
  const { data } = await api.get("/admin/auth/me");
  return data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<ForgotPasswordResponse> => {
  const { data } = await api.post("/admin/auth/forgot-password", payload);
  return data;
};

export const verifyResetToken = async (token: string): Promise<VerifyResetTokenResponse> => {
  const { data } = await api.get(`/admin/auth/verify-reset-token/${token}`);
  return data;
};

export const resetPassword = async (token: string, payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
  const { data } = await api.post(`/admin/auth/reset-password/${token}`, payload);
  return data;
};

export const changePassword = async (payload: ChangePasswordPayload): Promise<ChangePasswordResponse> => {
  const { data } = await api.patch("/admin/auth/change-password", payload);
  return data;
};

export const updateProfileGeneral = async (
  payload: UpdateProfileGeneralPayload,
) => {
  const { data } = await api.patch("/admin/auth/me/general", payload);
  return data;
};

export const updateDashboardPreferences = async (
  payload: DashboardPreferences,
) => {
  const { data } = await api.patch(
    "/admin/auth/me/dashboard-preferences",
    payload,
  );
  return data;
};