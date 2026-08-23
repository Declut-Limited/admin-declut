import Button from "@/components/generic/Button";
import { useState } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { BsCheckCircleFill } from "react-icons/bs";
import type { RoleEntry } from "../types";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";

const MODULES_FULL_PERMISSIONS = [
  "Users",
  "Listings",
  "Categories",
  "Reviews",
  "Transactions",
  "Reports",
  "Activity",
  "Content",
  "Notifications",
  "Settings",
] as const;

const MODULES_VIEW_ONLY = ["Dashboard"] as const;

const ALL_MODULES = [...MODULES_VIEW_ONLY, ...MODULES_FULL_PERMISSIONS];

function createEmptyPermissions() {
  return ALL_MODULES.map((module) => ({
    module,
    view: false,
    write: false,
    delete: false,
  }));
}

const initialRoles: RoleEntry[] = [
  {
    id: "1",
    role: "Super Admin",
    permissions: ALL_MODULES.map((m) => ({
      module: m,
      view: true,
      write: true,
      delete: true,
    })),
  },
  {
    id: "2",
    role: "Finance Manager",
    permissions: ALL_MODULES.map((m) => ({
      module: m,
      view: true,
      write: true,
      delete: true,
    })),
  },
  {
    id: "3",
    role: "Trust & Safety",
    permissions: ALL_MODULES.map((m) => ({
      module: m,
      view: true,
      write: true,
      delete: true,
    })),
  },
  {
    id: "4",
    role: "Support Agent",
    permissions: ALL_MODULES.map((m) => ({
      module: m,
      view: true,
      write: false,
      delete: false,
    })),
  },
];

export function RolesPermissionsTab() {
  const [roles, setRoles] = useState<RoleEntry[]>(initialRoles);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const togglePermission = (
    roleId: string,
    module: string,
    field: "view" | "write" | "delete",
  ) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? {
              ...r,
              permissions: r.permissions.map((p) =>
                p.module === module ? { ...p, [field]: !p[field] } : p,
              ),
            }
          : r,
      ),
    );
  };

  const updateRoleName = (id: string, name: string) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, role: name } : r)),
    );
  };

  const handleAddRole = () => {
    const existingEmptyRole = roles.find((r) => r.isNew && !r.role.trim());
    if (existingEmptyRole) {
      setExpandedId(existingEmptyRole.id);
      return;
    }

    const newRole: RoleEntry = {
      id: crypto.randomUUID(),
      role: "",
      permissions: createEmptyPermissions(),
      isNew: true,
    };
    setRoles((prev) => [...prev, newRole]);
    setExpandedId(newRole.id);
  };

  const handleDeleteRole = (id: string) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleSave = (id: string) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isNew: false } : r)),
    );
    setExpandedId(null);
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Category Commission Overrides</h3>

      <div className="roles-accordion">
        <div className="roles-accordion-header-row">
          <span className="roles-accordion-header-role">Role</span>
        </div>

        {roles.map((r) => {
          const isExpanded = expandedId === r.id;
          return (
            <div key={r.id} className="roles-accordion-item">
              <div
                className={`roles-accordion-row ${isExpanded ? "roles-accordion-row-expanded" : ""}`}
              >
                <div className="roles-accordion-role-box">
                  {r.isNew ? (
                    <input
                      type="text"
                      placeholder="Enter role"
                      value={r.role}
                      onChange={(e) => updateRoleName(r.id, e.target.value)}
                      className="roles-accordion-role-input"
                    />
                  ) : (
                    <span className="roles-accordion-role-name">{r.role}</span>
                  )}
                </div>

                <button
                  type="button"
                  className="roles-accordion-actions-label"
                  onClick={() => toggleExpand(r.id)}
                >
                  {isExpanded ? "Set actions" : "Actions"}
                </button>

                <div className="roles-accordion-controls">
                  {isExpanded && (
                    <>
                      {r.isNew && (
                        <button
                          type="button"
                          className="roles-accordion-delete"
                          onClick={() => handleDeleteRole(r.id)}
                        >
                          Delete
                        </button>
                      )}
                      <Button
                        onClick={() => handleSave(r.id)}
                        bgColor="bg-green-600 hover:bg-green-700"
                        textColor="text-white"
                        borderColor="border-transparent"
                      >
                        <BsCheckCircleFill className="mr-1.5" />
                        Save
                      </Button>
                    </>
                  )}
                  <button
                    type="button"
                    className="roles-accordion-chevron"
                    onClick={() => toggleExpand(r.id)}
                    aria-label="Toggle role permissions"
                  >
                    {isExpanded ? (
                      <TiArrowSortedUp className="w-4 h-4" />
                    ) : (
                      <TiArrowSortedDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="roles-accordion-panel">
                  <div className="roles-permissions-matrix-scroll">
                    <table className="roles-permissions-matrix">
                      <thead>
                        <tr>
                          <th className="roles-permissions-matrix-header-module">
                            Module
                          </th>
                          <th className="roles-permissions-matrix-header-action">
                            View
                          </th>
                          <th className="roles-permissions-matrix-header-action">
                            Write
                          </th>
                          <th className="roles-permissions-matrix-header-action">
                            Delete
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.permissions.map((p) => {
                          const isViewOnly = (
                            MODULES_VIEW_ONLY as readonly string[]
                          ).includes(p.module);
                          return (
                            <tr
                              key={p.module}
                              className="roles-permissions-matrix-row"
                            >
                              <td className="roles-permissions-matrix-module">
                                {p.module}
                              </td>
                              <td className="roles-permissions-matrix-checkbox-cell">
                                <input
                                  type="checkbox"
                                  checked={p.view}
                                  onChange={() =>
                                    togglePermission(r.id, p.module, "view")
                                  }
                                  className="roles-permissions-matrix-checkbox"
                                />
                              </td>
                              <td className="roles-permissions-matrix-checkbox-cell">
                                {!isViewOnly && (
                                  <input
                                    type="checkbox"
                                    checked={p.write}
                                    onChange={() =>
                                      togglePermission(r.id, p.module, "write")
                                    }
                                    className="roles-permissions-matrix-checkbox"
                                  />
                                )}
                              </td>
                              <td className="roles-permissions-matrix-checkbox-cell">
                                {!isViewOnly && (
                                  <input
                                    type="checkbox"
                                    checked={p.delete}
                                    onChange={() =>
                                      togglePermission(r.id, p.module, "delete")
                                    }
                                    className="roles-permissions-matrix-checkbox"
                                  />
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="w-2/3 mt-4">
        <Button
          onClick={handleAddRole}
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
