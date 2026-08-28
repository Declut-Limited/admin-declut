import Button from "@/components/generic/Button";
import FormInput from "@/components/generic/FormInput";
import { useState, useMemo } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
// import type { ActiveSession } from "../types";
import { useChangePassword } from "@/features/auth/queries";
import { showToast } from "@/lib/utils/toast";

// const mockSessions: ActiveSession[] = [
//   {
//     id: "1",
//     device: "2024 MacBook Pro 14-inch",
//     location: "Melbourne, Australia",
//     timestamp: "22 Jan at 10:40am",
//     is_current: true,
//   },
//   {
//     id: "2",
//     device: "2024 MacBook Pro 14-inch",
//     location: "Melbourne, Australia",
//     timestamp: "22 Jan at 10:40am",
//     is_current: false,
//   },
//   {
//     id: "3",
//     device: "2024 MacBook Pro 14-inch",
//     location: "Melbourne, Australia",
//     timestamp: "22 Jan at 10:40am",
//     is_current: false,
//   },
//   {
//     id: "4",
//     device: "2024 MacBook Pro 14-inch",
//     location: "Melbourne, Australia",
//     timestamp: "22 Jan at 10:40am",
//     is_current: false,
//   },
//   {
//     id: "5",
//     device: "2024 MacBook Pro 14-inch",
//     location: "Melbourne, Australia",
//     timestamp: "22 Jan at 10:40am",
//     is_current: false,
//   },
// ];

function getPasswordChecks(password: string) {
  return {
    length: password.length >= 10,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function getPasswordStrength(checks: ReturnType<typeof getPasswordChecks>) {
  const passed = Object.values(checks).filter(Boolean).length;
  if (passed <= 1)
    return { label: "Weak password", level: 1, color: "bg-red-500" };
  if (passed <= 3)
    return { label: "Fair password", level: 2, color: "bg-amber-500" };
  if (passed === 4)
    return { label: "Good password", level: 3, color: "bg-blue-500" };
  return { label: "Strong password", level: 4, color: "bg-green-500" };
}

export function SecurityLoginTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const checks = useMemo(() => getPasswordChecks(newPassword), [newPassword]);
  const strength = useMemo(() => getPasswordStrength(checks), [checks]);
  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const allChecksPassed = Object.values(checks).every(Boolean);

  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const handleUpdatePassword = () => {
    if (!allChecksPassed || !passwordsMatch || !currentPassword) return;

    showToast.promise(
      changePassword({ currentPassword, newPassword }).then(() => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }),
      {
        loading: "Updating password...",
        success: "Your password has been changed.",
        error: "Couldn't update password.",
      },
    );
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Security & Login</h3>

      <div className="security-login-layout">
        <div className="security-login-form">
          <div className="settings-field">
            <label className="settings-field-label">
              Current Password <span className="text-brand-blue">*</span>
            </label>
            <div className="password-input-wrapper">
              <FormInput
                label=""
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((s) => !s)}
                className="password-input-toggle"
              >
                {showCurrent ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-field-label">
              New Password <span className="text-brand-blue">*</span>
            </label>
            <div className="password-input-wrapper">
              <FormInput
                label=""
                type={showNew ? "text" : "password"}
                placeholder="Enter current password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew((s) => !s)}
                className="password-input-toggle"
              >
                {showNew ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="password-strength-bar">
              {[1, 2, 3, 4].map((segment) => (
                <span
                  key={segment}
                  className={`password-strength-segment ${segment <= strength.level ? strength.color : ""}`}
                />
              ))}
            </div>
            <p
              className={`password-strength-label ${strength.level >= 4 ? "text-green-600" : strength.level >= 3 ? "text-blue-500" : strength.level >= 2 ? "text-amber-500" : "text-red-500"}`}
            >
              {strength.label}
            </p>

            <div className="password-requirements-grid">
              <p
                className={`password-requirement ${checks.length ? "password-requirement-met" : ""}`}
              >
                {checks.length && <BsCheckCircleFill className="w-3.5 h-3.5" />}{" "}
                At least 10 characters
              </p>
              <p
                className={`password-requirement ${checks.uppercase ? "password-requirement-met" : ""}`}
              >
                {checks.uppercase && (
                  <BsCheckCircleFill className="w-3.5 h-3.5" />
                )}{" "}
                One uppercase letter
              </p>
              <p
                className={`password-requirement ${checks.lowercase ? "password-requirement-met" : ""}`}
              >
                {checks.lowercase && (
                  <BsCheckCircleFill className="w-3.5 h-3.5" />
                )}{" "}
                One lowercase letter
              </p>
              <p
                className={`password-requirement ${checks.number ? "password-requirement-met" : ""}`}
              >
                {checks.number && <BsCheckCircleFill className="w-3.5 h-3.5" />}{" "}
                One number
              </p>
              <p
                className={`password-requirement ${checks.special ? "password-requirement-met" : ""}`}
              >
                {checks.special && (
                  <BsCheckCircleFill className="w-3.5 h-3.5" />
                )}{" "}
                One special character
              </p>
            </div>
          </div>

          <div className="settings-field">
            <label className="settings-field-label">
              Confirm New Password <span className="text-brand-blue">*</span>
            </label>
            <div className="password-input-wrapper">
              <FormInput
                label=""
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((s) => !s)}
                className="password-input-toggle"
              >
                {showConfirm ? (
                  <FiEyeOff className="w-4 h-4" />
                ) : (
                  <FiEye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500 mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => {}}
              bgColor="bg-white dark:bg-gray-800"
              textColor="text-brand-gray-dark dark:text-gray-200"
              borderColor="border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePassword}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              disabled={
                isPending ||
                !allChecksPassed ||
                !passwordsMatch ||
                !currentPassword
              }
            >
              <BsCheckCircleFill className="mr-1.5" />
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>

        {/* <div className="active-sessions-panel">
          <p className="active-sessions-title">Active Sessions</p>
          <p className="active-sessions-hint">
            Review the devices currently signed in to your Declut Admin account.
          </p>

          <div className="active-sessions-list">
            {mockSessions.map((session) => (
              <div key={session.id} className="active-session-row">
                <FiMonitor className="active-session-icon" />
                <div className="flex-1">
                  <div className="active-session-device-row">
                    <p className="active-session-device">{session.device}</p>
                    {session.is_current && (
                      <span className="active-session-badge">Active now</span>
                    )}
                  </div>
                  <p className="active-session-meta">
                    {session.location} · {session.timestamp}
                  </p>
                </div>
                {!session.is_current && (
                  <button
                    type="button"
                    className="active-session-signout"
                    onClick={() => {}}
                  >
                    Sign out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </div>
  );
}
