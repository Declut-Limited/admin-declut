import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import PageLoader from "@/components/generic/PageLoader";
import { FiMail } from "react-icons/fi";
import { IoAlertCircle } from "react-icons/io5";
import { useUser, useSuspendUser, useReactivateUser } from "../queries";
import type { SuspendUserPayload } from "../types";
import SuspendUserModal from "./SuspendUserModal";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import { formatPhoneNumber } from "@/lib/utils/phone";

interface AdminUserDetailsModalProps {
  userId: string;
  onClose: () => void;
}

const statusPillClass: Record<string, string> = {
  active: "bg-[#ECFDF3] text-[#027A48] dark:bg-green-950 dark:text-green-400",
  pending: "bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400",
  suspended: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
  deactivated: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
};

const statusFallback =
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatModule(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function AdminUserDetailsModal({
  userId,
  onClose,
}: AdminUserDetailsModalProps) {
  const [suspendOpen, setSuspendOpen] = useState(false);

  const { data: user, isLoading, isError } = useUser(userId);
  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();
  const { mutate: reactivateUser, isPending: isReactivating } =
    useReactivateUser();

  const adminUser = user && user.type === "admin" ? user : null;
  const details = adminUser?.details;

  const displayName = details?.name ?? details?.email ?? "";
  const canSuspend = details?.status === "active";
  const roleName = details?.assignedRole?.name ?? details?.role ?? "";
  const permissions = details?.assignedRole?.permissions ?? null;

  const handleConfirmSuspend = (payload: SuspendUserPayload) => {
    suspendUser(
      { userId, payload },
      {
        onSuccess: () => {
          showToast.success("User suspended", {
            description: `${displayName} has been suspended.`,
          });
          setSuspendOpen(false);
        },
        onError: (error) =>
          showToast.error("Couldn't suspend user", {
            description: getApiErrorMessage(error),
          }),
      },
    );
  };

  const handleReactivate = () => {
    reactivateUser(userId, {
      onSuccess: () =>
        showToast.success("User reactivated", {
          description: `${displayName} can now access their account.`,
        }),
      onError: (error) =>
        showToast.error("Couldn't reactivate user", {
          description: getApiErrorMessage(error),
        }),
    });
  };

  // const handleSendReminder = () => {
  //   // TODO: no send-reminder endpoint in the API yet
  //   showToast.info("Not available yet", {
  //     description: "Sending reminders isn't wired up to the backend yet.",
  //   });
  // };

  return (
    <BaseModal title="User Details" onClose={onClose} width="max-w-3xl" height = "h-[85vh]">
      {isLoading ? (
        <PageLoader />
      ) : isError || !adminUser || !details ? (
        <p className="text-sm text-brand-gray-dark dark:text-gray-300 py-6 text-center">
          Couldn't load this admin user.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, #D19E00, #2563EB)",
                }}
              >
                {getInitials(displayName)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1D2939] dark:text-gray-100">
                    {displayName}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusPillClass[details.status] ?? statusFallback
                    }`}
                  >
                    {formatStatus(details.status)}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F4F3FF] text-[#5925DC] dark:bg-indigo-950 dark:text-indigo-400">
                    {details.role}
                  </span>
                </div>
                <p className="text-xs text-brand-gray-light dark:text-gray-400 mt-0.5">
                  {[details.email, formatPhoneNumber(details.phone)]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* <Button
                onClick={handleSendReminder}
                leftIcon={<FiBell className="w-4 h-4 text-white" />}
                bgColor="bg-[#2563EB] hover:bg-[#3F5EE0]"
                textColor="text-white"
                borderColor="border-transparent"
              >
                Send Reminder
              </Button> */}
              <Button
                onClick={() => {
                  window.location.href = `mailto:${details.email}`;
                }}
                leftIcon={<FiMail className="w-4 h-4 text-[#98A2B3]" />}
              >
                Email
              </Button>
              {canSuspend ? (
                <Button
                  onClick={() => setSuspendOpen(true)}
                  leftIcon={<IoAlertCircle className="w-4 h-4" />}
                  bgColor="bg-[#FFFBFA] dark:bg-gray-900"
                  textColor="text-[#F04438]"
                  borderColor="border-[#F04438] dark:border-red-900"
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  onClick={handleReactivate}
                  disabled={isReactivating}
                  bgColor="bg-[#F6FEF9] dark:bg-gray-900"
                  textColor="text-[#027A48]"
                  borderColor="border-[#027A48] dark:border-green-900"
                >
                  {isReactivating ? "Reactivating..." : "Reactivate"}
                </Button>
              )}
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide mb-2">
              User Info
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Title</span>
              <span className="profile-info-value">{details.title}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Slug</span>
              <span className="profile-info-value">{details.slug}</span>
            </div>
            {details.company && (
              <div className="profile-info-row">
                <span className="profile-info-label">Company</span>
                <span className="profile-info-value">{details.company}</span>
              </div>
            )}
            <div className="profile-info-row">
              <span className="profile-info-label">Role(s)</span>
              <span className="flex gap-1.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F4F3FF] text-[#5925DC] dark:bg-indigo-950 dark:text-indigo-400">
                  {roleName}
                </span>
                {/* <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    statusPillClass[details.status] ?? statusFallback
                  }`}
                >
                  {formatStatus(details.status)}
                </span> */}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">
                {formatDate(details.createdAt)}
              </span>
            </div>
          </div>

          {permissions && (
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide mb-3">
                Module Permissions
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-brand-gray-light dark:text-gray-400">
                    <th className="font-medium pb-2">Module</th>
                    <th className="font-medium pb-2 text-center">View</th>
                    <th className="font-medium pb-2 text-center">Write</th>
                    <th className="font-medium pb-2 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissions).map(([module, perm]) => (
                    <tr
                      key={module}
                      className="border-t border-gray-50 dark:border-gray-800"
                    >
                      <td className="py-2 text-brand-gray-light dark:text-gray-200">
                        {formatModule(module)}
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={perm.view}
                          readOnly
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={perm.write}
                          readOnly
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={perm.delete}
                          readOnly
                          className="rounded border-gray-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {suspendOpen && (
        <SuspendUserModal
          userName={displayName}
          isSubmitting={isSuspending}
          onClose={() => setSuspendOpen(false)}
          onConfirm={handleConfirmSuspend}
        />
      )}
    </BaseModal>
  );
}
