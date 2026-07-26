import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import FormInput from "@/components/generic/FormInput";
import CustomSelect from "@/components/generic/CustomSelect";
import Button from "@/components/generic/Button";
import type { ModulePermission } from "@/features/users/types";


interface InviteUserModalProps {
  onClose: () => void;
}

const roleOptions = ["Admin", "Buyer/Seller"];

const defaultPermissions: ModulePermission[] = [
  { module: "Dashboard", view: true, write: false, delete: false },
  { module: "Users", view: true, write: false, delete: false },
  { module: "Listings", view: true, write: false, delete: false },
  { module: "Categories", view: true, write: false, delete: false },
];

export default function InviteUserModal({ onClose }: InviteUserModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Admin");
  const [company, setCompany] = useState("");
  const [permissions, setPermissions] = useState<ModulePermission[]>(defaultPermissions);

  const togglePermission = (index: number, key: "view" | "write" | "delete") => {
    setPermissions((prev) =>
      prev.map((perm, i) => (i === index ? { ...perm, [key]: !perm[key] } : perm))
    );
  };

  const handleSubmit = () => {
    // TODO: wire to usersApi.inviteUser 
    console.log({ fullName, email, role, company, permissions });
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
            textColor="text-[#475467] dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            bgColor="bg-[#2563EB] hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            Save &amp; Validate
          </Button>
        </>
      }
    >
      {/* user information */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
        <p className="text-xs font-semibold text-[#667085] dark:text-gray-400 uppercase tracking-wide mb-3">
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

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect label="Role" required value={role} options={roleOptions} onChange={setRole} />
          <FormInput
            label="Company (optional)"
            placeholder="e.g. Zenith Traders"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      </div>

      {/* module access & permissions */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-xs font-semibold text-[#667085] dark:text-gray-400 uppercase tracking-wide mb-1">
          Module Access &amp; Permissions
        </p>
        <p className="text-xs text-[#667085] dark:text-gray-400 mb-3">
          Admins always get View access by default; enable Write/Delete per module as needed.
        </p>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[#475467] dark:text-gray-400 font-semibold">
              <th className="font-medium pb-2">Module</th>
              <th className="font-medium pb-2 text-center">View</th>
              <th className="font-medium pb-2 text-center">Write</th>
              <th className="font-medium pb-2 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {permissions.map((perm, index) => (
              <tr key={perm.module} className="border-t border-gray-100 dark:border-gray-800">
                <td className="py-2.5 text-[#475467] dark:text-gray-200">{perm.module}</td>
                <td className="py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={perm.view}
                    onChange={() => togglePermission(index, "view")}
                    className="rounded border-gray-300 text-[#2563EB] focus:ring-indigo-500"
                  />
                </td>
                <td className="py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={perm.write}
                    onChange={() => togglePermission(index, "write")}
                    className="rounded border-gray-300 text-[#2563EB] focus:ring-indigo-500"
                  />
                </td>
                <td className="py-2.5 text-center">
                  <input
                    type="checkbox"
                    checked={perm.delete}
                    onChange={() => togglePermission(index, "delete")}
                    className="rounded border-gray-300 text-[#2563EB] focus:ring-indigo-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BaseModal>
  );
}