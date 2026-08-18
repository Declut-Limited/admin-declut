import Button from "@/components/generic/Button";
import ToggleSwitch from "@/components/generic/ToggleSwitch";
import { useState } from "react";
import type { RoleCommissionOverride } from "../types";
import { FaCirclePlus } from "react-icons/fa6";

const CATEGORIES = ["marketplace", "money", "trust_safety", "admin"] as const;

export function RolesPermissionsTab() {
  const [roles, setRoles] = useState<RoleCommissionOverride[]>([
    {
      role: "Super Admin",
      users_count: 3,
      marketplace: true,
      money: true,
      trust_safety: true,
      admin: true,
    },
    {
      role: "Finance Manager",
      users_count: 5,
      marketplace: true,
      money: true,
      trust_safety: true,
      admin: true,
    },
    {
      role: "Trust & Safety",
      users_count: 8,
      marketplace: true,
      money: true,
      trust_safety: true,
      admin: true,
    },
    {
      role: "Support Agent",
      users_count: 14,
      marketplace: true,
      money: true,
      trust_safety: true,
      admin: true,
    },
  ]);

  const toggleCell = (
    roleIndex: number,
    category: (typeof CATEGORIES)[number],
  ) => {
    setRoles((prev) =>
      prev.map((r, i) =>
        i === roleIndex ? { ...r, [category]: !r[category] } : r,
      ),
    );
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Category Commission Overrides</h3>

      <table className="roles-permissions-table">
        <thead>
          <tr>
            <th className="roles-permissions-table-header-role">Role</th>
            <th className="roles-permissions-table-header-users">Users</th>
            <th className="roles-permissions-table-header-category">
              Marketplace
            </th>
            <th className="roles-permissions-table-header-category">Money</th>
            <th className="roles-permissions-table-header-category">
              Trust & Safety
            </th>
            <th className="roles-permissions-table-header-category">Admin</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role.role} className="roles-permissions-table-row">
              <td className="roles-permissions-table-role-name">{role.role}</td>
              <td className="roles-permissions-table-users-count">
                {role.users_count}
              </td>
              {CATEGORIES.map((category) => (
                <td
                  key={category}
                  className="roles-permissions-table-toggle-cell"
                >
                  <ToggleSwitch
                    checked={role[category]}
                    onChange={() => toggleCell(index, category)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-2/3">
        <Button
          onClick={() => {}}
          bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
          textColor="text-white"
          borderColor="border-transparent"
        >
          <FaCirclePlus className="mr-1.5" />
          Add Role
        </Button>
      </div>
    </div>
  );
}
