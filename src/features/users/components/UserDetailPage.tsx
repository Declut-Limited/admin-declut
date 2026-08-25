import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FiMail, FiEye, FiStar, FiUserX, FiChevronDown } from "react-icons/fi";
import Button from "@/components/generic/Button";
import EmptyState from "@/components/generic/EmptyState";
import { FaArrowLeftLong, FaArrowRightArrowLeft } from "react-icons/fa6";
import { IoAlertCircle, IoCard } from "react-icons/io5";
import { FaTags } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import NotFoundState from "@/components/generic/NotFoundState";
import PageLoader from "@/components/generic/PageLoader";
import Pagination from "@/components/generic/Pagination";
import SuspendUserModal from "./SuspendUserModal";
import {
  useUser,
  useListingsByUser,
  useSuspendUser,
  useReactivateUser,
  useUpdateUserKyc,
} from "../queries";
import type { KycStatus, SuspendUserPayload } from "../types";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import { BsCheckCircleFill } from "react-icons/bs";

const LISTINGS_PAGE_SIZE = 20;
const NOT_IN_API_YET = "—";

const KYC_STATUS_OPTIONS: KycStatus[] = [
  "unverified",
  "pending",
  "verified",
  "rejected",
];

const verificationStatusClass: Record<string, string> = {
  Approved:
    "text-[#027A48] bg-[#F6FEF9] inline-flex items-center px-2 py-0.5 rounded-full dark:text-green-400 dark:bg-green-950",

  Verified:
    "text-[#027A48] bg-[#F6FEF9] inline-flex items-center px-2 py-0.5 rounded-full dark:text-green-400 dark:bg-green-950",
  Rejected:
    "text-[#B42318] bg-[#FEF3F2] inline-flex items-center px-2 py-0.5 rounded-full dark:text-red-400 dark:bg-red-950",
  Unverified:
    "text-[#B42318] bg-[#FEF3F2] inline-flex items-center px-2 py-0.5 rounded-full dark:text-red-400 dark:bg-red-950",
  Pending:
    "text-[#B54708] bg-[#FFFAEB] inline-flex items-center px-2 py-0.5 rounded-full dark:text-amber-400 dark:bg-amber-950",
};

const statusPillClass: Record<string, string> = {
  active: "bg-[#ECFDF3] text-[#027A48] dark:bg-green-950 dark:text-green-400",
  pending: "bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400",
  suspended: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
  banned: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
};

const transactionStatusPillClass: Record<string, string> = {
  completed:
    "bg-[#ECFDF3] text-[#027A48] dark:bg-green-950 dark:text-green-400",
  pending: "bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400",
  failed: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
  refunded:
    "bg-[#F4F3FF] text-[#5925DC] dark:bg-indigo-950 dark:text-indigo-400",
};

const statusFallback =
  "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

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

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [listingsPage, setListingsPage] = useState(1);
  const [suspendOpen, setSuspendOpen] = useState(false);

  const [kycMenuOpen, setKycMenuOpen] = useState(false);
  const kycMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        kycMenuRef.current &&
        !kycMenuRef.current.contains(e.target as Node)
      ) {
        setKycMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: user, isLoading, isError } = useUser(userId);

  const isAdminUser = user?.type === "admin";

  const {
    data: listingsData,
    isLoading: listingsLoading,
    isError: listingsError,
  } = useListingsByUser(
    userId,
    { page: listingsPage, limit: LISTINGS_PAGE_SIZE },
    !isAdminUser,
  );

  const { mutate: updateKyc, isPending: isUpdatingKyc } = useUpdateUserKyc();

  const { mutate: suspendUser, isPending: isSuspending } = useSuspendUser();
  const { mutate: reactivateUser, isPending: isReactivating } =
    useReactivateUser();

  if (isLoading) return <PageLoader />;
  if (isError || !user) {
    return (
      <NotFoundState
        icon={<FiUserX className="w-5 h-5" />}
        message="User not found."
      />
    );
  }

  const adminUser = user.type === "admin" ? user : null;
  const regularUser = user.type === "user" ? user : null;

  const details = user.details;
  const insights = regularUser?.insights ?? null;
  const recentTransactions = regularUser?.recentTransactions ?? [];
  const permissions = adminUser?.details.permissions ?? null;

  const listings = listingsError ? [] : (listingsData?.results ?? []);
  const listingsTotal = listingsError ? 0 : (listingsData?.total ?? 0);
  const listingsTotalPages = Math.max(
    1,
    Math.ceil(listingsTotal / LISTINGS_PAGE_SIZE),
  );

  // `details` has no name field yet — fall back to the seller on their listings,
  // then to the row we navigated from, then to email.
  const nameFromList = (location.state as { name?: string } | null)?.name;
  const seller = listings[0]?.seller;
  //TODO:add name from user when api is update
  const displayName =
    details?.name ?? seller?.name ?? nameFromList ?? details.email;

  const canSuspend = details.status === "active";
  const ratingValue = insights ? Number(insights.rating.value) || 0 : 0;

  const handleConfirmSuspend = (payload: SuspendUserPayload) => {
    if (!userId) return;
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
    if (!userId) return;
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

  const kycStatus = regularUser?.details.kycStatus;

  const handleUpdateKyc = (status: KycStatus) => {
    if (!userId) return;

    updateKyc(
      { userId, payload: { status } },
      {
        onSuccess: () =>
          showToast.success("KYC status updated", {
            description: `${displayName}'s verification is now ${formatStatus(status)}.`,
          }),
        onError: (error) =>
          showToast.error("Couldn't update KYC status", {
            description: getApiErrorMessage(error),
          }),
      },
    );
    setKycMenuOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => navigate("/users")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FaArrowLeftLong className="w-4 h-4" /> Back to Users
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
          >
            {getInitials(displayName)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-[#1D2939] dark:text-gray-100">
                {displayName}
              </h1>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  statusPillClass[details.status] ?? statusFallback
                }`}
              >
                {formatStatus(details.status)}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F4F3FF] text-[#5925DC] dark:bg-indigo-950 dark:text-indigo-400">
                {adminUser ? adminUser.details.title : details.role}
              </span>
            </div>
            <p className="text-xs text-brand-gray-light dark:text-gray-400 mt-0.5">
              {regularUser
                ? `${regularUser.details.slug} · ${details.email} · ${regularUser.details.phone}`
                : details.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {kycStatus && (
            <div className="relative" ref={kycMenuRef}>
              <Button
                onClick={() => setKycMenuOpen((o) => !o)}
                disabled={isUpdatingKyc}
                leftIcon={<BsCheckCircleFill className="w-4 h-4" />}
                rightIcon={
                  <FiChevronDown
                    className={`w-4 h-4 transition-transform ${kycMenuOpen ? "rotate-180" : ""}`}
                  />
                }
                bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
                textColor="text-white"
                borderColor="border-transparent"
              >
                {isUpdatingKyc
                  ? "Updating..."
                  : `KYC: ${formatStatus(kycStatus)}`}
              </Button>

              {kycMenuOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-50">
                  {KYC_STATUS_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleUpdateKyc(option)}
                      disabled={option === kycStatus}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${
                        option === kycStatus
                          ? "text-brand-blue font-medium"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {formatStatus(option)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
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
              Suspend
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

      {/* stats: user accounts only; the admin payload has no insights */}
      {insights && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="detail-stat-card">
            <p className="detail-stat-value">
              {insights.listings.total}
              <span className="text-xs font-medium text-[#16A34A]">
                {insights.listings.active} active
              </span>
            </p>
            <p className="detail-stat-label">
              <FaTags className="w-4 h-4 text-brand-gray-dark" />
              Total Listings
            </p>
          </div>

          <div className="detail-stat-card">
            <p className="detail-stat-value">
              {insights.sales.total}
              <span className="text-xs font-medium text-[#16A34A]">
                {insights.sales.completed} completed sales
              </span>
            </p>
            <p className="detail-stat-label">
              <IoCard className="w-4 h-4 text-brand-gray-dark" /> Sales as
              Seller
            </p>
          </div>

          <div className="detail-stat-card">
            <p className="detail-stat-value">
              {insights.purchases.total}
              <span className="text-xs font-medium text-[#16A34A]">
                {currency.format(insights.purchases.amountSpent)}
              </span>
            </p>
            <p className="detail-stat-label">
              <FaArrowRightArrowLeft className="w-4 h-4 text-brand-gray-dark" />{" "}
              Purchases as Buyer
            </p>
          </div>

          <div className="detail-stat-card">
            <p className="detail-stat-value">
              {insights.rating.value} / 5
              <span className="text-xs font-medium text-[#16A34A]">
                {insights.rating.reviewCount} reviews
              </span>
            </p>
            <p className="detail-stat-label">
              <TiStarFullOutline className="w-3.5 h-3.5" /> Rating
            </p>
          </div>
        </div>
      )}

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* listings */}
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide mb-3">
              Listings by {displayName} ({listingsTotal})
            </p>

            {listingsLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded animate-pulse bg-gray-200 dark:bg-gray-700"
                  />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <EmptyState
                message={
                  isAdminUser
                    ? "Admin accounts don't have listings."
                    : "No listings yet."
                }
              />
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-brand-gray-dark dark:text-gray-400">
                      <th className="font-medium pb-2">Listing</th>
                      <th className="font-medium pb-2">Category</th>
                      <th className="font-medium pb-2">Price</th>
                      <th className="font-medium pb-2">Status</th>
                      <th className="font-medium pb-2">Date</th>
                      <th className="font-medium pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((listing) => (
                      <tr
                        key={listing._id}
                        className="border-t border-gray-50 dark:border-gray-800"
                      >
                        <td className="py-2.5">
                          <p className="font-medium text-brand-gray-dark dark:text-gray-100">
                            {listing.title}
                          </p>
                          <p className="text-xs text-brand-gray-dark">
                            {listing.slug}
                          </p>
                        </td>
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                          {listing.category?.title ?? "—"}
                        </td>
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                          {currency.format(listing.price)}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full inline-flex items-center px-2 py-0.5 text-xs ${
                              statusPillClass[listing.status] ?? statusFallback
                            }`}
                          >
                            {formatStatus(listing.status)}
                          </span>
                        </td>
                        <td className="py-2.5 text-brand-gray-dark dark:text-gray-400">
                          {formatDate(listing.createdAt)}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() => navigate(`/listings/${listing._id}`)}
                            className="text-brand-gray-dark hover:text-gray-600 cursor-pointer"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {listingsTotalPages > 1 && (
                  <Pagination
                    currentPage={listingsPage}
                    totalPages={listingsTotalPages}
                    onPageChange={setListingsPage}
                  />
                )}
              </>
            )}
          </div>

          {/* transactions */}
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-dark dark:text-gray-400 uppercase tracking-wide mb-3">
              Recent Transactions
            </p>

            {recentTransactions.length === 0 ? (
              <EmptyState
                message={
                  adminUser
                    ? "Admin accounts don't have transactions."
                    : "No transactions yet."
                }
              />
            ) : (
              <div className="flex flex-col gap-3">
                {recentTransactions.map((txn) => (
                  <div
                    key={txn.transactionId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/transactions/${txn.transactionId}`)
                        }
                        className="text-sm text-brand-blue hover:underline cursor-pointer"
                      >
                        {/* TODO: API returns no item title or txn code — showing the id
                  until those fields are added */}
                        {txn.transactionId}
                      </button>

                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#F4F3FF] text-[#5925DC] dark:bg-indigo-950 dark:text-indigo-400">
                        as {formatStatus(txn.role)}
                      </span>

                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                          transactionStatusPillClass[txn.status] ??
                          statusFallback
                        }`}
                      >
                        {formatStatus(txn.status)}
                      </span>

                      <span className="text-xs text-brand-gray-light">
                        {formatDate(txn.createdAt)}
                      </span>
                    </div>

                    <p
                      className={`text-sm font-semibold ${
                        txn.direction === "inflow"
                          ? "text-[#027A48]"
                          : "text-[#B42318]"
                      }`}
                    >
                      {txn.direction === "inflow" ? "+" : "−"}
                      {currency.format(txn.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide mb-2">
              Profile
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Role</span>
              <span className="profile-info-value">{details.role}</span>
            </div>
            {adminUser && (
              <div className="profile-info-row">
                <span className="profile-info-label">Title</span>
                <span className="profile-info-value">
                  {adminUser.details.title}
                </span>
              </div>
            )}
            <div className="profile-info-row">
              <span className="profile-info-label">Status</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  statusPillClass[details.status] ?? statusFallback
                }`}
              >
                {formatStatus(details.status)}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{details.email}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Phone</span>
              <span className="profile-info-value">
                {regularUser ? regularUser.details.phone : NOT_IN_API_YET}
              </span>
            </div>
            {/* <div className="profile-info-row">
              <span className="profile-info-label">Company</span>
              <span className="profile-info-value">{NOT_IN_API_YET}</span>
            </div> */}
            <div className="profile-info-row">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">
                {formatDate(details.createdAt)}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Rating</span>
              {insights ? (
                <span className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(ratingValue)
                          ? "fill-[#F79009] text-[#F79009]"
                          : "text-gray-200"
                      }`}
                    />
                  ))}
                </span>
              ) : (
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              )}
            </div>
          </div>

          {/* verification: user accounts only */}
          {user.type === "user" && (
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide mb-2">
                Verification
              </p>
              <div className="profile-info-row">
                <span className="profile-info-label">Type</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Submitted</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Status</span>
                {regularUser?.details.kycStatus ? (
                  <span
                    className={`text-sm font-medium ${
                      verificationStatusClass[
                        formatStatus(regularUser.details.kycStatus)
                      ] ?? ""
                    }`}
                  >
                    {formatStatus(regularUser.details.kycStatus)}
                  </span>
                ) : (
                  <span className="profile-info-value">{NOT_IN_API_YET}</span>
                )}
              </div>
            </div>
          )}

          {/* module permissions: admin accounts only */}
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
                          // disabled
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={perm.write}
                          readOnly
                          // disabled
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-2 text-center">
                        <input
                          type="checkbox"
                          checked={perm.delete}
                          readOnly
                          // disabled
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
      </div>

      {suspendOpen && (
        <SuspendUserModal
          userName={displayName}
          isSubmitting={isSuspending}
          onClose={() => setSuspendOpen(false)}
          onConfirm={handleConfirmSuspend}
        />
      )}
    </div>
  );
}
