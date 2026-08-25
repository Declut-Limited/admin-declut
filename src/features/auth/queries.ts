import { useMutation, useQuery } from "@tanstack/react-query"
import { changePassword, forgotPassword, getMe, login, logout, resetPassword, verifyResetToken } from "./api"
import type { ChangePasswordPayload, ForgotPasswordPayload, LoginPayload, ResetPasswordPayload } from "./types"
import { useNavigate } from "react-router-dom"
import { showToast } from "@/lib/utils/toast"

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (res) => {
      localStorage.setItem("access_token", res.data.accessToken)
      localStorage.setItem("refresh_token", res.data.refreshToken)
    },
  })
}

export const useLogout = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem("refresh_token") ?? ""
      return logout({ refreshToken })
    },
    onSuccess: () => {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      showToast.success("Signed out", { description: "You've been logged out." })
      navigate("/sign-in")
    },
    onError: () => {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      navigate("/sign-in")
    },
  })
}

export const useMe = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    select: (res) => res.data,
    staleTime: 5 * 60 * 1000, //30 min
  })
}

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
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(token as string, payload),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
};