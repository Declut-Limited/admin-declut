import { useState, useMemo } from "react";
import BaseModal from "@/components/generic/BaseModal";
import CustomSelect from "@/components/generic/CustomSelect";
import Button from "@/components/generic/Button";
import { useRoles } from "@/features/settings/queries";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

interface EditAdminRoleModalProps {
  adminName: string;
  currentRoleId?: string;
  currentRoleName?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (roleId: string) => void;
}

function formatModule(module: string) {
  return module.charAt(0).toUpperCase() + module.slice(1);
}

export default function EditAdminRoleModal({
  adminName,
  currentRoleId,
  currentRoleName,
  isSubmitting,
  onClose,
  onConfirm,
}: EditAdminRoleModalProps) {
  const [roleId, setRoleId] = useState(currentRoleId ?? "");

  const {
    data: roles = [],
    isLoading: rolesLoading,
    isError: rolesError,
    error: rolesErrorObj,
  } = useRoles();

  const roleOptions = useMemo(() => roles.map((r) => r.name), [roles]);

  const initialRoleId = useMemo(() => {
    if (currentRoleId) return currentRoleId;
    return roles.find((r) => r.name === currentRoleName)?._id ?? "";
  }, [currentRoleId, currentRoleName, roles]);

  const effectiveRoleId = roleId || initialRoleId;

  const selectedRole = useMemo(
    () => roles.find((r) => r._id === effectiveRoleId) ?? null,
    [roles, effectiveRoleId],
  );

  const permissionRows = useMemo(() => {
    if (!selectedRole) return [];
    return Object.entries(selectedRole.permissions).map(([module, perm]) => ({
      module,
      ...perm,
    }));
  }, [selectedRole]);

  const canSubmit = Boolean(selectedRole) && roleId !== currentRoleId;

  const handleSubmit = () => {
    if (!canSubmit || !selectedRole) return;
    onConfirm(selectedRole._id);
  };

  return (
    <BaseModal
      title={`Change role for ${adminName}`}
      onClose={onClose}
      width="max-w-3xl"
      footer={
        <>
          <Button
            onClick={onClose}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
        <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide mb-3">
          Role
        </p>

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            label="Assigned Role"
            required
            value={
              selectedRole?.name ??
              (rolesLoading ? "Loading..." : "Select a role")
            }
            options={roleOptions}
            onChange={(name) => {
              const match = roles.find((r) => r.name === name);
              if (match) setRoleId(match._id);
            }}
          />
        </div>

        {rolesError && (
          <p className="text-xs text-red-500 mt-1">
            {getApiErrorMessage(rolesErrorObj, "Couldn't load roles.")}
          </p>
        )}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide mb-1">
          Module Access &amp; Permissions
        </p>
        <p className="text-xs text-brand-gray-light dark:text-gray-400 mb-3">
          Permissions come from the selected role. Manage them in Settings
          &rarr; Roles &amp; Permissions.
        </p>

        {!selectedRole ? (
          <p className="text-sm text-brand-gray-light py-4">
            Select a role to see its permissions.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-brand-gray-dark dark:text-gray-400 font-semibold">
                <th className="font-medium pb-2">Module</th>
                <th className="font-medium pb-2 text-center">View</th>
                <th className="font-medium pb-2 text-center">Write</th>
                <th className="font-medium pb-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {permissionRows.map((perm) => (
                <tr
                  key={perm.module}
                  className="border-t border-gray-100 dark:border-gray-800"
                >
                  <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">
                    {formatModule(perm.module)}
                  </td>
                  <td className="py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={perm.view}
                      disabled
                      className="rounded border-gray-300 text-brand-blue focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={perm.write}
                      disabled
                      className="rounded border-gray-300 text-brand-blue focus:ring-indigo-500"
                    />
                  </td>
                  <td className="py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={perm.delete}
                      disabled
                      className="rounded border-gray-300 text-brand-blue focus:ring-indigo-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </BaseModal>
  );
}
