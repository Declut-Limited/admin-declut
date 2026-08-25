import { useParams, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiArrowLeft, FiSearch } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { IoIosCloseCircle } from "react-icons/io";
import Button from "@/components/generic/Button";
import placeholderImage from "@/assets/listing-header.jpg";
import NotFoundState from "@/components/generic/NotFoundState";
import PageLoader from "@/components/generic/PageLoader";
import { useDispute, useUpdateReportStatus } from "../queries";
import { showToast } from "@/lib/utils/toast";
import type { ReportStatus } from "../types";

const NOT_IN_API_YET = "—";

const statusPillClass: Record<string, string> = {
  new: "bg-blue-50 text-brand-blue dark:bg-blue-950 dark:text-blue-400",
  investigating:
    "bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400",
  dismissed:
    "bg-gray-50 text-brand-gray-light dark:bg-gray-800 dark:text-gray-400",
  resolved: "bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400",
};

const statusFallback =
  "bg-gray-50 text-brand-gray-light dark:bg-gray-800 dark:text-gray-400";

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
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

export default function DisputeDetailPage() {
  const { reportCode } = useParams<{ reportCode: string }>();
  const navigate = useNavigate();

  const { data: dispute, isLoading, isError } = useDispute(reportCode);
  const { mutateAsync: updateStatus, isPending } = useUpdateReportStatus();

  if (isLoading) return <PageLoader />;
  if (isError || !dispute) {
    return (
      <NotFoundState
        icon={<FiAlertCircle className="w-5 h-5" />}
        message="Dispute not found."
      />
    );
  }

  const { listing, user } = dispute;

  const changeStatus = (status: ReportStatus, verb: string) => {
    showToast.promise(
      updateStatus({ reportId: dispute._id, payload: { status } }),
      {
        loading: `${verb} ${dispute.slug}...`,
        success: `${dispute.slug} is now ${status}.`,
        error: `Couldn't update ${dispute.slug}.`,
      },
    );
  };

  return (
    <div>
      <button
        onClick={() => navigate("/disputes")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Disputes
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-[#FAFAFA] dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1D2939] dark:text-gray-100 tracking-wide">
              Report {dispute.slug}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                statusPillClass[dispute.status] ?? statusFallback
              }`}
            >
              {formatStatus(dispute.status)}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {dispute.slug} · Reported {formatDate(dispute.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {dispute.status === "new" && (
            <Button
              onClick={() => changeStatus("investigating", "Investigating")}
              disabled={isPending}
              leftIcon={<FiSearch className="w-4 h-4 text-[#98A2B3]" />}
            >
              Investigate
            </Button>
          )}
          {dispute.status !== "resolved" && (
            <Button
              onClick={() => changeStatus("resolved", "Resolving")}
              disabled={isPending}
              leftIcon={<BsCheckCircleFill className="w-4 h-4" />}
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              borderColor="border-transparent"
            >
              Resolve
            </Button>
          )}
          {dispute.status !== "dismissed" && (
            <Button
              onClick={() => changeStatus("dismissed", "Dismissing")}
              disabled={isPending}
              leftIcon={<IoIosCloseCircle className="w-4 h-4" />}
              bgColor="bg-[#FFFBFA] dark:bg-gray-900"
              textColor="text-[#F04438]"
              borderColor="border-[#F04438] dark:border-red-900"
            >
              Dismiss
            </Button>
          )}
        </div>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Report
            </p>
            <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
              {dispute.title}
            </p>
            <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-1">
              {dispute.reason}
            </p>
          </div>

          <div className="detail-section-card border-none">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
                Reported Listing
              </p>
              {listing && (
                <button
                  type="button"
                  onClick={() => navigate(`/listings/${listing.slug}`)}
                  className="text-xs text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View Listing ↗
                </button>
              )}
            </div>

            {listing ? (
              <div className="flex items-center gap-3">
                <img
                  src={listing.mainImage || placeholderImage}
                  className="w-12 h-12 rounded-lg shrink-0 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                    {listing.title}
                  </p>
                  <p className="text-xs text-brand-gray-light">
                    {listing.slug}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-brand-gray-light">
                This report isn't tied to a listing.
              </p>
            )}
          </div>
        </div>

        <div className="detail-section-card border-none">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
              Reported User
            </p>
            {user && (
              <button
                type="button"
                onClick={() => navigate(`/users/${user._id}`)}
                className="text-xs text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View User ↗
              </button>
            )}
          </div>

          {!user ? (
            <p className="text-sm text-brand-gray-light">
              This report isn't tied to a user.
            </p>
          ) : (
            <>
              <div className="profile-info-row">
                <span className="profile-info-label">Name</span>
                <span className="profile-info-value">{user.name}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">ID</span>
                <span className="profile-info-value">{user.slug}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{user.email}</span>
              </div>
              {/* TODO: role, status, company, member since and rating are not
                  returned by /admin/reports/{slug} */}
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
              <div className="profile-info-row">
                <span className="profile-info-label">Rating</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
