import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWaitlistInsights,
  getWaitlist,
  getUninvitedWaitlist,
  removeWaitlistUser,
  inviteWaitlistUser,
  bulkInviteWaitlist,
  exportWaitlist,
} from "./api";
import type {
  WaitlistListParams,
  InviteUserPayload,
  BulkInvitePayload,
} from "./types";

export const useWaitlistInsights = () => {
  return useQuery({
    queryKey: ["waitlist", "insights"],
    queryFn: getWaitlistInsights,
    select: (res) => res.data,
  });
};

export const useWaitlist = (params: WaitlistListParams) => {
  return useQuery({
    queryKey: ["waitlist", "list", params],
    queryFn: () => getWaitlist(params),
    select: (res) => res.data,
  });
};

export const useUninvitedWaitlist = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["waitlist", "uninvited", params],
    queryFn: () => getUninvitedWaitlist(params),
    select: (res) => res.data,
  });
};

const useWaitlistMutation = <TVars>(
  mutationFn: (vars: TVars) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["waitlist"],
        refetchType: "all",
      });
    },
  });
};
export const useRemoveWaitlistUser = () =>
  useWaitlistMutation((waitlistId: string) => removeWaitlistUser(waitlistId));

export const useInviteWaitlistUser = () =>
  useWaitlistMutation(
    ({
      waitlistId,
      payload,
    }: {
      waitlistId: string;
      payload: InviteUserPayload;
    }) => inviteWaitlistUser(waitlistId, payload),
  );

export const useBulkInviteWaitlist = () =>
  useWaitlistMutation((payload: BulkInvitePayload) =>
    bulkInviteWaitlist(payload),
  );

export const useExportWaitlist = () => {
  return useMutation({
    mutationFn: (params: Omit<WaitlistListParams, "page" | "limit">) =>
      exportWaitlist(params),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `waitlist-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
};
