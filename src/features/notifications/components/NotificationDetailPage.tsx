import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBellOff } from "react-icons/fi";
import Button from "@/components/generic/Button";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { NotificationDetail } from "../types";
import edit from "@/assets/icons/edit-2.svg";
import settings from "@/assets/icons/setting-5.svg";
import NotFoundState from "@/components/generic/NotFoundState";

const statusPillClass: Record<NotificationDetail["status"], string> = {
  Draft: "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  Scheduled:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Sent: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

// placeholder
const mockNotifications: Record<string, NotificationDetail> = {
  "3": {
    code: "NTF-003",
    title: "Account Reactivated",
    status: "Sent",
    kind: "Automated",
    triggeredBy: "Account Reactivated",
    channel: "Push",
    recipientLabel: "Adaeze Ibrahim",
    triggerSetup: {
      campaignType: "Featured",
      appliesTo: "Beauty",
      eligibleAudience: "Buyers",
      startDate: "Jun 28, 2026",
      endDate: "Jul 18, 2026",
    },
    messagePreview: {
      channelTo: "Push to Adaeze Ibrahim",
      body: "Account Reactivated",
    },
    recipient: {
      name: "Ngozi Nwosu",
      id: "USR-004",
      email: "ngozi.nwosu@mail.com",
      role: "Admin",
      status: "Active",
      company: "Delta Electronics",
      totalListings: 2,
      memberSince: "Apr 27, 2025",
      rating: 5,
    },
  },
};

export default function NotificationDetailPage() {
  const { notificationId } = useParams<{ notificationId: string }>();
  const navigate = useNavigate();
  const notif = notificationId ? mockNotifications[notificationId] : undefined;

  if (!notif) {
    return (
      <NotFoundState
        icon={<FiBellOff className="w-5 h-5" />}
        message="Notification not found."
      />
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/notifications")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Notifications
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-wide text-[#1D2939] dark:text-gray-100">
              {notif.title}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[notif.status]}`}
            >
              {notif.status}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950 text-brand-blue dark:text-blue-400">
              {notif.kind}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {notif.code} · Triggered by: {notif.triggeredBy} · {notif.channel} ·
            to {notif.recipientLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button leftIcon={<img src={edit} className="w-4 h-4" />}>
            Revert to Draft
          </Button>
          <Button
            leftIcon={<img src={settings} className="w-4 h-4" />}
            onClick={() => navigate("/notifications/automation-rules")}
          >
            View Automation Rules
          </Button>
        </div>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Trigger &amp; Setup
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Campaign Type</span>
              <span className="profile-info-value">
                {notif.triggerSetup.campaignType}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Applies To</span>
              <span className="profile-info-value">
                {notif.triggerSetup.appliesTo}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Eligible Audience</span>
              <span className="profile-info-value">
                {notif.triggerSetup.eligibleAudience}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Start Date</span>
              <span className="profile-info-value">
                {notif.triggerSetup.startDate}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">End Date</span>
              <span className="profile-info-value">
                {notif.triggerSetup.endDate}
              </span>
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Message Preview
            </p>
            <p className="text-xs text-brand-gray-light">
              {notif.messagePreview.channelTo}
            </p>
            <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100 mt-1">
              {notif.messagePreview.body}
            </p>
          </div>
        </div>

        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Recipient
          </p>

          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={notif.recipient.avatarUrl || avatarPlaceholder}
              alt={notif.recipient.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                {notif.recipient.name}
              </p>
              <p className="text-xs text-brand-gray-light">
                {notif.recipient.id} · {notif.recipient.email} ·{" "}
                {notif.recipient.company}
              </p>
            </div>
          </div>

          <div className="profile-info-row">
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value">{notif.recipient.role}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
              {notif.recipient.status}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Company</span>
            <span className="profile-info-value">
              {notif.recipient.company}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Total Listings</span>
            <span className="profile-info-value">
              {notif.recipient.totalListings}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Member Since</span>
            <span className="profile-info-value">
              {notif.recipient.memberSince}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Rating</span>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < notif.recipient.rating
                      ? "text-amber-400"
                      : "text-gray-200"
                  }
                >
                  ★
                </span>
              ))}
            </span>
          </div>

          <button
            onClick={() => navigate(`/users/${notif.recipient.id}`)}
            className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg mt-3 cursor-pointer"
          >
            View User Profile
          </button>
        </div>
      </div>
    </div>
  );
}
