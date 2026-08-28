import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  forgotPassword,
  getMe,
  login,
  logout,
  resetPassword,
  updateDashboardPreferences,
  updateProfileGeneral,
  verifyResetToken,
} from "./api";
import type {
  ChangePasswordPayload,
  ForgotPasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
} from "./types";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/lib/utils/toast";
import type {
  DashboardPreferences,
  UpdateProfileGeneralPayload,
} from "../profile/types";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (res) => {
      localStorage.setItem("access_token", res.data.accessToken);
      localStorage.setItem("refresh_token", res.data.refreshToken);
      queryClient.clear();
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem("refresh_token") ?? "";
      return logout({ refreshToken });
    },
    onSuccess: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      showToast.success("Signed out", {
        description: "You've been logged out.",
      });
      navigate("/sign-in", { replace: true });
      setTimeout(() => queryClient.clear(), 0);
    },
    onError: () => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/sign-in", { replace: true });
      setTimeout(() => queryClient.clear(), 0);
    },
  });
};

export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    select: (res) => res.data,
    staleTime: 10 * 60 * 1000,
    enabled: Boolean(localStorage.getItem("access_token")),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });
};

export const useVerifyResetToken = (token: string | undefined) => {
  return useQuery({
    queryKey: ["auth", "verify-reset-token", token],
    queryFn: () => verifyResetToken(token as string),
    enabled: !!token,
    retry: false,
  });
};

export const useResetPassword = (token: string | undefined) => {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      resetPassword(token as string, payload),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
};

const useProfileMutation = <TVars>(
  mutationFn: (vars: TVars) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useUpdateProfileGeneral = () =>
  useProfileMutation((payload: UpdateProfileGeneralPayload) =>
    updateProfileGeneral(payload),
  );

export const useUpdateDashboardPreferences = () =>
  useProfileMutation((payload: DashboardPreferences) =>
    updateDashboardPreferences(payload),
  );
