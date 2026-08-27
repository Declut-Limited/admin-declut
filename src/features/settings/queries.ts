import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoles, createRole, updateRole, deleteRole } from "./api";
import type { CreateRolePayload, UpdateRolePayload } from "./types";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
    select: (res) => res.data,
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