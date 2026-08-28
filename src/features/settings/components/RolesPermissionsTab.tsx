import Button from "@/components/generic/Button";
import { useState, useMemo } from "react";
import { FaCirclePlus } from "react-icons/fa6";
import { BsCheckCircleFill } from "react-icons/bs";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import ConfirmModal from "@/components/generic/ConfirmModal";
import PageLoader from "@/components/generic/PageLoader";
import { showToast } from "@/lib/utils/toast";
import {
  useRoles,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from "../queries";
import type { Role, RolePermissions } from "../types";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

const MODULES = [
  "dashboard",
  "users",
  "listings",
  "categories",
  "reviews",
  "transactions",
  "reports",
  "activity",
  "content",
  // "referrals",
  // "waitlist",
  "notifications",
  "settings",
  "roles",
] as const;

const VIEW_ONLY_MODULES: readonly string[] = ["dashboard"];

interface DraftRole {
  id: string;
  name: string;
  permissions: RolePermissions;
  isNew?: boolean;
}

function formatModule(module: string) {
  return module.charAt(0).toUpperCase() + module.slice(1);
}

function emptyPermissions(): RolePermissions {
  return MODULES.reduce((acc, module) => {
    acc[module] = { view: false, write: false, delete: false };
    return acc;
  }, {} as RolePermissions);
}

function normalizePermissions(permissions: RolePermissions): RolePermissions {
  return MODULES.reduce((acc, module) => {
    acc[module] = permissions[module] ?? {
      view: false,
      write: false,
      delete: false,
    };
    return acc;
  }, {} as RolePermissions);
}

export function RolesPermissionsTab() {
  const { data: roles = [], isLoading, isError, error, refetch } = useRoles();

  const [drafts, setDrafts] = useState<Record<string, DraftRole>>({});
  const [newRole, setNewRole] = useState<DraftRole | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);

  const { mutateAsync: createRole, isPending: isCreating } = useCreateRole();
  const { mutateAsync: updateRole, isPending: isUpdating } = useUpdateRole();
  const { mutateAsync: removeRole, isPending: isDeleting } = useDeleteRole();

  const rows: DraftRole[] = useMemo(() => {
    const existing = roles.map(
      (role) =>
        drafts[role._id] ?? {
          id: role._id,
          name: role.name,
          permissions: normalizePermissions(role.permissions),
        },
    );
    return newRole ? [...existing, newRole] : existing;
  }, [roles, drafts, newRole]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const updateDraft = (row: DraftRole, next: Partial<DraftRole>) => {
    if (row.isNew) {
      setNewRole((prev) => (prev ? { ...prev, ...next } : prev));
    } else {
      setDrafts((prev) => ({ ...prev, [row.id]: { ...row, ...next } }));
    }
  };

  const togglePermission = (
    row: DraftRole,
    module: string,
    field: "view" | "write" | "delete",
  ) => {
    const current = row.permissions[module];
    updateDraft(row, {
      permissions: {
        ...row.permissions,
        [module]: { ...current, [field]: !current[field] },
      },
    });
  };

  const handleAddRole = () => {
    if (newRole) {
      setExpandedId(newRole.id);
      return;
    }

    const draft: DraftRole = {
      id: crypto.randomUUID(),
      name: "",
      permissions: emptyPermissions(),
      isNew: true,
    };
    setNewRole(draft);
    setExpandedId(draft.id);
  };

  const handleSave = (row: DraftRole) => {
    if (row.isNew) {
      if (!row.name.trim()) {
        showToast.error("Role name required", {
          description: "Give the role a name before saving.",
        });
        return;
      }

      showToast.promise(
        createRole({
          name: row.name.trim(),
          permissions: row.permissions,
        }).then(() => {
          setNewRole(null);
          setExpandedId(null);
        }),
        {
          loading: `Creating ${row.name.trim()}...`,
          success: `${row.name.trim()} has been created.`,
          error: "Couldn't create role.",
        },
      );
      return;
    }

    showToast.promise(
      updateRole({
        roleId: row.id,
        payload: { name: row.name.trim(), permissions: row.permissions },
      }).then(() => {
        setDrafts((prev) => {
          const next = { ...prev };
          delete next[row.id];
          return next;
        });
        setExpandedId(null);
      }),
      {
        loading: `Updating ${row.name}...`,
        success: `${row.name} has been updated.`,
        error: "Couldn't update role.",
      },
    );
  };

  const handleDiscardNew = () => {
    setNewRole(null);
    setExpandedId(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingRole) return;

    showToast.promise(
      removeRole(deletingRole._id).then(() => setDeletingRole(null)),
      {
        loading: `Removing ${deletingRole.name}...`,
        success: `${deletingRole.name} has been removed.`,
        error: "Couldn't remove role.",
      },
    );
  };

  if (isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="settings-panel">
        <h3 className="settings-panel-title">Roles &amp; Permissions</h3>
        <div className="flex flex-col items-center justify-center gap-2 py-10">
          <p className="text-sm text-brand-gray-dark dark:text-gray-300">
            {getApiErrorMessage(error, "Couldn't load roles.")}
          </p>
          <button
            onClick={() => refetch()}
            className="text-sm text-brand-blue hover:underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Roles &amp; Permissions</h3>

      <div className="roles-accordion">
        <div className="roles-accordion-header-row">
          <span className="roles-accordion-header-role">Role</span>
        </div>

        {rows.map((r) => {
          const isExpanded = expandedId === r.id;
          const sourceRole = roles.find((role) => role._id === r.id);

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
                      value={r.name}
                      onChange={(e) => updateDraft(r, { name: e.target.value })}
                      className="roles-accordion-role-input"
                    />
                  ) : (
                    <span className="roles-accordion-role-name">{r.name}</span>
                  )}
                </div>

                <button
                  type="button"
                  className="roles-accordion-actions-label"
                  onClick={() => toggleExpand(r.id)}
                >
                  {isExpanded ? "Set actions" : "Actions"}
                  {sourceRole ? (
                    <span className="text-xs text-brand-gray-light ml-2">
                      {sourceRole.userCount} user
                      {sourceRole.userCount === 1 ? "" : "s"}
                    </span>
                  ) : null}
                </button>

                <div className="roles-accordion-controls">
                  {isExpanded && (
                    <>
                      {r.isNew ? (
                        <button
                          type="button"
                          className="roles-accordion-delete"
                          onClick={handleDiscardNew}
                        >
                          Discard
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="roles-accordion-delete"
                          onClick={() =>
                            sourceRole && setDeletingRole(sourceRole)
                          }
                        >
                          Delete
                        </button>
                      )}
                      <Button
                        onClick={() => handleSave(r)}
                        disabled={isCreating || isUpdating}
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
                        {MODULES.map((module) => {
                          const p = r.permissions[module];
                          const isViewOnly = VIEW_ONLY_MODULES.includes(module);

                          return (
                            <tr
                              key={module}
                              className="roles-permissions-matrix-row"
                            >
                              <td className="roles-permissions-matrix-module">
                                {formatModule(module)}
                              </td>
                              <td className="roles-permissions-matrix-checkbox-cell">
                                <input
                                  type="checkbox"
                                  checked={p.view}
                                  onChange={() =>
                                    togglePermission(r, module, "view")
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
                                      togglePermission(r, module, "write")
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
                                      togglePermission(r, module, "delete")
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

      {deletingRole && (
        <ConfirmModal
          title="Remove role"
          message={
            deletingRole.userCount > 0
              ? `${deletingRole.name} is assigned to ${deletingRole.userCount} user${
                  deletingRole.userCount === 1 ? "" : "s"
                }. Removing it can't be undone.`
              : `Remove ${deletingRole.name}? This can't be undone.`
          }
          confirmLabel="Remove"
          isSubmitting={isDeleting}
          onClose={() => setDeletingRole(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
