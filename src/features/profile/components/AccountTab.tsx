import Button from "@/components/generic/Button";
import Skeleton from "@/components/generic/Skeleton";
import { useState } from "react";
import { useMe } from "@/features/auth/queries";
import type { AdminProfile } from "@/features/auth/types";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

const NOT_IN_API_YET = "—";

const accountStatusPillClass: Record<string, string> = {
  Active: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  Suspended: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
};

function formatModule(module: string) {
  return module.charAt(0).toUpperCase() + module.slice(1);
}

function formatDate(iso: string | null) {
  if (!iso) return NOT_IN_API_YET;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return NOT_IN_API_YET;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(iso: string | null) {
  if (!iso) return NOT_IN_API_YET;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return NOT_IN_API_YET;

  const isToday = new Date().toDateString() === date.toDateString();
  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) return `Today, ${time}`;
  return `${date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}, ${time}`;
}

export function AccountTab() {
  const { data: me, isLoading, isError, error } = useMe();
  const [permissionsOpen, setPermissionsOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="settings-panel">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (isError || !me) {
    return (
      <div className="settings-panel">
        <p className="text-sm text-brand-gray-dark dark:text-gray-300">
          {getApiErrorMessage(error, "Couldn't load your account.")}
        </p>
      </div>
    );
  }

  const account: AdminProfile = me;
  // TODO: accountStatus, activeSessions and failedAttempts aren't on /me
  const accountStatus = "Active";

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Account</h3>

      <div className="account-info-grid">
        <div className="account-info-item">
          <p className="account-info-label">Admin ID</p>
          <p className="account-info-value">{account.id}</p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Full Name</p>
          <p className="account-info-value">{account.name}</p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Work Email</p>
          <p className="account-info-value">{account.email}</p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Role</p>
          <p className="account-info-value account-info-value-link">
            {account.role?.name}
          </p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Account Status</p>
          <span
            className={`w-12 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${accountStatusPillClass[accountStatus] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
          >
            {accountStatus}
          </span>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Account Created</p>
          <p className="account-info-value">{formatDate(account.createdAt)}</p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Last Profile Update</p>
          <p className="account-info-value">
            {formatDateTime(account.lastProfileUpdateAt)}
          </p>
        </div>
      </div>

      <div className="account-role-banner">
        <div>
          <p className="account-role-banner-title">{account.role?.name}</p>
          <p className="account-role-banner-hint">
            Your role and permissions are managed by a Super Admin.
          </p>
        </div>
        <Button
          onClick={() => setPermissionsOpen((o) => !o)}
          bgColor="transparent"
          textColor="text-brand-gray-dark dark:text-gray-200"
          borderColor="border-gray-200 dark:border-gray-700"
        >
          {permissionsOpen ? "Hide Permission" : "View Permission"}
        </Button>
      </div>

      {permissionsOpen && account.role?.permissions && (
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
                {Object.entries(account.role.permissions).map(
                  ([module, perm]) => (
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
                          checked={perm.view}
                          disabled
                          className="roles-permissions-matrix-checkbox"
                        />
                      </td>
                      <td className="roles-permissions-matrix-checkbox-cell">
                        <input
                          type="checkbox"
                          checked={perm.write}
                          disabled
                          className="roles-permissions-matrix-checkbox"
                        />
                      </td>
                      <td className="roles-permissions-matrix-checkbox-cell">
                        <input
                          type="checkbox"
                          checked={perm.delete}
                          disabled
                          className="roles-permissions-matrix-checkbox"
                        />
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="account-stats-grid">
        <div className="account-stat-card border-none">
          <p className="account-stat-label">Last Login</p>
          <p className="account-stat-value">
            {formatDateTime(account.lastLoginAt)}
          </p>
        </div>
        <div className="account-stat-card border-none">
          <p className="account-stat-label">Password Changed</p>
          <p className="account-stat-value">
            {formatDateTime(account.passwordChangedAt)}
          </p>
        </div>
        {/* TODO: activeSessions not returned by /admin/auth/me */}
        <div className="account-stat-card border-none">
          <p className="account-stat-label">Active Sessions</p>
          <p className="account-stat-value">{NOT_IN_API_YET}</p>
        </div>
        {/* TODO: failedAttempts not returned by /admin/auth/me */}
        <div className="account-stat-card border-none">
          <p className="account-stat-label">Failed Attempts</p>
          <p className="account-stat-value">{NOT_IN_API_YET}</p>
        </div>
      </div>
    </div>
  );
}