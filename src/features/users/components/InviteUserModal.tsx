import { useState, useMemo } from "react";
import BaseModal from "@/components/generic/BaseModal";
import FormInput from "@/components/generic/FormInput";
import CustomSelect from "@/components/generic/CustomSelect";
import Button from "@/components/generic/Button";
import { useRoles } from "@/features/settings/queries";
import { useInviteSubAdmin } from "../queries";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
// import { FiEye, FiEyeOff } from "react-icons/fi";

interface InviteUserModalProps {
  onClose: () => void;
}

function formatModule(module: string) {
  return module.charAt(0).toUpperCase() + module.slice(1);
}

export default function InviteUserModal({ onClose }: InviteUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [title, setTitle] = useState("");
  // const [company, setCompany] = useState("");
  const [roleName, setRoleName] = useState("");

  // const [showPassword, setShowPassword] = useState(false);

  const {
    data: roles = [],
    isLoading: rolesLoading,
    isError: rolesError,
    error: rolesErrorObj,
  } = useRoles();
  const { mutateAsync: inviteSubAdmin, isPending } = useInviteSubAdmin();

  const roleOptions = useMemo(() => roles.map((r) => r.name), [roles]);

  const selectedRole = useMemo(
    () => roles.find((r) => r.name === roleName) ?? null,
    [roles, roleName],
  );

  const permissionRows = useMemo(() => {
    if (!selectedRole) return [];
    return Object.entries(selectedRole.permissions).map(([module, perm]) => ({
      module,
      ...perm,
    }));
  }, [selectedRole]);

  const canSubmit =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    // password.trim().length > 0 &&
    // title.trim().length > 0 &&
    Boolean(selectedRole);

  const handleSubmit = () => {
    if (!canSubmit || !selectedRole) return;

    showToast.promise(
      inviteSubAdmin({
        name: fullName.trim(),
        email: email.trim(),
        // password: password.trim(),
        // title: title.trim(),
        // company: company.trim(),
        roleId: selectedRole._id,
      }).then(() => onClose()),
      {
        loading: `Inviting ${fullName.trim()}...`,
        success: `${fullName.trim()} has been invited.`,
        error: "Couldn't invite user.",
      },
    );
  };

  return (
    <BaseModal
      title="Invite User"
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
            disabled={!canSubmit || isPending}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isPending ? "Inviting..." : "Save & Validate"}
          </Button>
        </>
      }
    >
      {/* user information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
        <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide mb-3">
          User Information
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <FormInput
            label="Full Name"
            required
            placeholder="E.g Ogunleti Oscar"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <FormInput
            label="Email"
            required
            type="email"
            placeholder="name@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Temporary Password / Title — no longer part of the invite payload
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <FormInput
              label="Temporary Password"
              required
              type={showPassword ? "text" : "password"}
              placeholder="Set an initial password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-8.5 text-gray-400 hover:text-gray-600 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FiEyeOff className="w-4 h-4" />
              ) : (
                <FiEye className="w-4 h-4" />
              )}
            </button>
          </div>
          <FormInput
            label="Title"
            required
            placeholder="e.g. Support Lead"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        */}

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            label="Role"
            required
            value={roleName || (rolesLoading ? "Loading..." : "Select a role")}
            options={roleOptions}
            onChange={setRoleName}
          />
          {/* Company — no longer part of the invite payload
          <FormInput
            label="Company (optional)"
            placeholder="e.g. Zenith Traders"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          */}
        </div>
        {rolesError && (
          <p className="text-xs text-red-500 mt-1">
            {getApiErrorMessage(rolesErrorObj, "Couldn't load roles.")}
          </p>
        )}
      </div>

      {/* module access & permissions */}
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
