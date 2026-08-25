import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, exportUsers, getUserById, suspendUser, reactivateUser, getListingsByUser, updateUserKyc } from "./api";
import type { SuspendUserPayload, UpdateKycPayload, UsersListParams } from "./types";

export const useUsers = (params: UsersListParams) => {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    select: (res) => res.data,
    placeholderData: (previous) => previous,
  });
};

export const useExportUsers = () => {
  return useMutation({
    mutationFn: (params: Omit<UsersListParams, "page" | "limit">) => exportUsers(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};

export const useUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["users", "detail", userId],
    queryFn: () => getUserById(userId as string),
    enabled: !!userId,
    select: (res) => res.data,
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: SuspendUserPayload }) =>
      suspendUser(userId, payload),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
    },
  });
};

export const useReactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => reactivateUser(userId),
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
    },
  });
};

export const useListingsByUser = (
  userId: string | undefined,
  params: { page?: number; limit?: number },
  enabled = true,
) => {
  return useQuery({
    queryKey: ["users", "listings", userId, params],
    queryFn: () => getListingsByUser(userId as string, params),
    enabled: !!userId && enabled,
    retry: false,
    select: (res) => res.data,
    placeholderData: (previous) => previous,
  });
};

export const useUpdateUserKyc = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateKycPayload }) =>
      updateUserKyc(userId, payload),
    onSuccess: (_data, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", userId] });
    },
  });
};