import Button from "@/components/generic/Button";
import type { ProfileAccount } from "../types";

const mockAccount: ProfileAccount = {
  admin_id: "ADM-0002",
  full_name: "Ekeleme Oscar",
  work_email: "EkelemeOscar@declut.com",
  role: "Operations",
  account_status: "Active",
  account_created: "14 February, 2026",
  last_profile_update: "Today, 09:14 AM",
  last_login: "Today, 09:14 AM",
  password_changed: "3 Months Ago",
  active_sessions: 3,
  failed_attempts: 1,
};

const accountStatusPillClass: Record<string, string> = {
  Active: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  Suspended: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
};

export function AccountTab() {
  const account = mockAccount;

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Account</h3>

      <div className="account-info-grid">
        <div className="account-info-item">
          <p className="account-info-label">Admin ID</p>
          <p className="account-info-value">{account.admin_id}</p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Full Name</p>
          <p className="account-info-value">{account.full_name}</p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Work Email</p>
          <p className="account-info-value">{account.work_email}</p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Role</p>
          <p className="account-info-value account-info-value-link">
            {account.role}
          </p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Account Status</p>
          <span
            className={`w-12 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${accountStatusPillClass[account.account_status] ?? "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
          >
            {account.account_status}
          </span>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Account Created</p>
          <p className="account-info-value">{account.account_created}</p>
        </div>
        <div className="account-info-item">
          <p className="account-info-label">Last Profile Update</p>
          <p className="account-info-value">{account.last_profile_update}</p>
        </div>
      </div>

      <div className="account-role-banner">
        <div>
          <p className="account-role-banner-title">Operations Manager</p>
          <p className="account-role-banner-hint">
            Your role and permissions are managed by a Super Admin.
          </p>
        </div>
        <Button
          onClick={() => {}}
          bgColor="transparent"
          textColor="text-brand-gray-dark dark:text-gray-200"
          borderColor="border-gray-200 dark:border-gray-700"
        >
          View Permission
        </Button>
      </div>

      <div className="account-stats-grid">
        <div className="account-stat-card border-none">
          <p className="account-stat-label">Last Login</p>
          <p className="account-stat-value">{account.last_login}</p>
        </div>
        <div className="account-stat-card border-none">
          <p className="account-stat-label">Password Changed</p>
          <p className="account-stat-value">{account.password_changed}</p>
        </div>
        <div className="account-stat-card border-none">
          <p className="account-stat-label">Active Sessions</p>
          <p className="account-stat-value">
            {account.active_sessions} Devices
          </p>
        </div>
        <div className="account-stat-card border-none">
          <p className="account-stat-label">Failed Attempts</p>
          <p className="account-stat-value">{account.failed_attempts}</p>
        </div>
      </div>
    </div>
  );
}
