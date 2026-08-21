import { api } from "@/lib/api/client";
import type {
  LoginPayload,
  LoginResponse,
  LogoutPayload,
  LogoutResponse,
  MeResponse,
} from "./types";

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
