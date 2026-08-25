import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock } from "react-icons/fi";
import NotFoundState from "@/components/generic/NotFoundState";
import PageLoader from "@/components/generic/PageLoader";
import { useActivityLog } from "../queries";
import {
  formatEvent,
  formatEntityType,
  formatState,
  formatTimestamp,
  formatActor,
} from "../utils";

const NOT_IN_API_YET = "—";

export default function ActivityLogDetailPage() {
  const { logId } = useParams<{ logId: string }>();
  const navigate = useNavigate();

  const { data: log, isLoading, isError } = useActivityLog(logId);

  if (isLoading) return <PageLoader />;
  if (isError || !log) {
    return (
      <NotFoundState
        icon={<FiClock className="w-5 h-5" />}
        message="Log not found."
      />
    );
  }

  const isSystemActor = log.actor === "system";

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
        <h1 className="text-xl font-bold text-[#1D2939] dark:text-gray-100 tracking-wide">
          {formatEvent(log.event)}
        </h1>
        <p className="text-xs text-brand-gray-light mt-1">
          {formatTimestamp(log.createdAt)}
          {log.ipAddress ? ` · IP ${log.ipAddress}` : ""}
        </p>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Event Detail
          </p>

          <div className="profile-info-row">
            <span className="profile-info-label">Action</span>
            <span className="profile-info-value">{formatEvent(log.event)}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Entity Type</span>
            <span className="profile-info-value">
              {formatEntityType(log.entityType)}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Entity ID</span>
            <span className="profile-info-value">{log.entityId}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Previous State</span>
            <span className="profile-info-value">
              {formatState(log.oldState)}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">New State</span>
            <span className="profile-info-value">
              {formatState(log.newState)}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">IP Address</span>
            {log.ipAddress ? (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-brand-gray-dark dark:text-gray-300">
                {log.ipAddress}
              </span>
            ) : (
              <span className="profile-info-value">{NOT_IN_API_YET}</span>
            )}
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Timestamp</span>
            <span className="profile-info-value">
              {formatTimestamp(log.createdAt)}
            </span>
          </div>

          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <>
              {Object.entries(log.metadata).map(([key, value]) => (
                <div key={key} className="profile-info-row">
                  <span className="profile-info-label">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}
                  </span>
                  <span className="profile-info-value">{String(value)}</span>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Actor
          </p>

          {/* TODO: `actor` is a bare id — name, email, role, status, company,
              listings, member since and rating are not returned by the API. */}
          <div className="profile-info-row">
            <span className="profile-info-label">Actor</span>
            <span className="profile-info-value">{formatActor(log.actor)}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Name</span>
            <span className="profile-info-value">{NOT_IN_API_YET}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Email</span>
            <span className="profile-info-value">{NOT_IN_API_YET}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Role</span>
            <span className="profile-info-value">{NOT_IN_API_YET}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Status</span>
            <span className="profile-info-value">{NOT_IN_API_YET}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Company</span>
            <span className="profile-info-value">{NOT_IN_API_YET}</span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Member Since</span>
            <span className="profile-info-value">{NOT_IN_API_YET}</span>
          </div>

          {!isSystemActor && (
            <button
              onClick={() => navigate(`/users/${log.actor}`)}
              className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg mt-3 cursor-pointer"
            >
              View User Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}