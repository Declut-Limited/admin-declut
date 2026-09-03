import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, createRole, updateRole, deleteRole, updateGeneralSettings, updatePaymentsSettings, updateFeesCommissionSettings, getSettings } from "./api";
import type { CreateRolePayload, FeesCommissionSettings, GeneralSettings, PaymentsSettings, UpdateRolePayload } from "./types";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    select: (res) => res.data.results,
  });
};

const useRoleMutation = <TVars,>(
  mutationFn: (vars: TVars) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useCreateRole = () =>
  useRoleMutation((payload: CreateRolePayload) => createRole(payload));

export const useUpdateRole = () =>
  useRoleMutation(
    ({ roleId, payload }: { roleId: string; payload: UpdateRolePayload }) =>
      updateRole(roleId, payload),
  );

export const useDeleteRole = () =>
  useRoleMutation((roleId: string) => deleteRole(roleId));


export const useSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    select: (res) => res.data,
  });
};

const useSettingsMutation = <TVars,>(
  mutationFn: (vars: TVars) => Promise<unknown>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};

export const useUpdateGeneralSettings = () =>
  useSettingsMutation((payload: GeneralSettings) =>
    updateGeneralSettings(payload),
  );

export const useUpdatePaymentsSettings = () =>
  useSettingsMutation((payload: PaymentsSettings) =>
    updatePaymentsSettings(payload),
  );

export const useUpdateFeesCommissionSettings = () =>
  useSettingsMutation((payload: FeesCommissionSettings) =>
    updateFeesCommissionSettings(payload),
  );