import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { ActivityLogDetail } from "../types";

// placeholder 
const mockLogs: Record<string, ActivityLogDetail> = {
  "1": {
    logCode: "LOG-001",
    action: "Resolved dispute",
    date: "Jun 25, 2026",
    ipAddress: "10.214.24.227.20",
    target: "DSP-012",
    timestamp: "Jul 12, 2026",
    actor: {
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

export default function ActivityLogDetailPage() {
  const { logId } = useParams<{ logId: string }>();
  const navigate = useNavigate();
  const log = logId ? mockLogs[logId] : undefined;

  if (!log) {
    return <div className="text-sm text-brand-gray-light">Log not found.</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate("/activity-logs")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Activity Logs
      </button>

      {/* header */}
      <div className="bg-[#FAFAFA] dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <h1 className="text-xl font-bold text-[#1D2939] dark:text-gray-100 tracking-wide">{log.action}</h1>
        <p className="text-xs text-brand-gray-light mt-1">
          {log.logCode} · {log.date} · IP {log.ipAddress}
        </p>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">Event Detail</p>

          <div className="profile-info-row">
            <span className="profile-info-label">Action</span>
            <span className="profile-info-value">{log.action}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Target</span>
            <span className="profile-info-value">{log.target}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">IP Address</span>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-brand-gray-dark dark:text-gray-300">
              {log.ipAddress}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Timestamp</span>
            <span className="profile-info-value">{log.timestamp}</span>
          </div>
        </div>

        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">Actor</p>

          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={log.actor.avatarUrl || avatarPlaceholder}
              alt={log.actor.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-[#1D2939] tracking-wide dark:text-gray-100">{log.actor.name}</p>
              <p className="text-xs text-brand-gray-light">
                {log.actor.id} · {log.actor.email} · {log.actor.company}
              </p>
            </div>
          </div>

          <div className="profile-info-row">
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value">{log.actor.role}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
              {log.actor.status}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Company</span>
            <span className="profile-info-value">{log.actor.company}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Total Listings</span>
            <span className="profile-info-value">{log.actor.totalListings}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Member Since</span>
            <span className="profile-info-value">{log.actor.memberSince}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Rating</span>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < log.actor.rating ? "text-amber-400" : "text-gray-200"}>★</span>
              ))}
            </span>
          </div>

          <button
            onClick={() => navigate(`/users/${log.actor.id}`)}
            className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg mt-3 cursor-pointer"
          >
            View User Profile
          </button>
        </div>
      </div>
    </div>
  );
}