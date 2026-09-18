import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPrinter,
  FiLock,
  FiEye,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { HiClock } from "react-icons/hi2";
import ImageGallery from "@/components/generic/ImageGallery";
import Button from "@/components/generic/Button";
import PageLoader from "@/components/generic/PageLoader";
import NotFoundState from "@/components/generic/NotFoundState";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import avatarPlaceholder from "@/assets/avatar.svg";
import { useEscrow } from "../queries";
import {
  statusPillClass as escrowStatusPillClass,
  statusFallback,
  currency,
  formatLabel,
  formatDate,
  formatDateTime,
} from "../statusStyles";
import { statusPillClass as txnStatusPillClass } from "@/features/transactions/statusStyles";
import layers from "@/assets/icons/layer-black.svg";
import frozen from "@/assets/icons/frozen.svg";
import { AiFillDollarCircle } from "react-icons/ai";
import { FaCheckCircle, FaUser, FaWallet } from "react-icons/fa";
import { TbRotate2 } from "react-icons/tb";
import { RiLock2Fill } from "react-icons/ri";
import type { EscrowDetailRecord } from "../types";

const badgeClass: Record<string, string> = {
  ...txnStatusPillClass,
  ...escrowStatusPillClass,
  processed: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
};

const tabsList = ["Overview", "Records", "Settlement", "Notes & Logs"];

function PlatformEarningsCard({
  earnings,
}: {
  earnings: EscrowDetailRecord["platformEarning"];
}) {
  return (
    <div className="detail-section-card border-none h-fit">
      <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
        Platform Earnings
      </p>
      <div className="profile-info-row">
        <span className="profile-info-label">Platform Fee</span>
        <span className="profile-info-value">
          {currency.format(earnings.platformFee)}
        </span>
      </div>
      <div className="profile-info-row border-b pb-2 border-gray-200 dark:border-gray-500">
        <span className="profile-info-label">Processing Fee</span>
        <span className="profile-info-value">
          {currency.format(earnings.processingFee)}
        </span>
      </div>
      <div className="profile-info-row">
        <span className="profile-info-label">Total Earned</span>
        <span className="text-sm font-semibold text-brand-blue">
          {currency.format(earnings.totalEarned)}
        </span>
      </div>
    </div>
  );
}

export default function EscrowDetailPage() {
  const { escrowId: routeParam } = useParams<{ escrowId: string }>();
  const navigate = useNavigate();

  const { data: escrow, isLoading, isError } = useEscrow(routeParam);

  const [activeTab, setActiveTab] = useState("Overview");

  if (isLoading) return <PageLoader />;

  if (isError || !escrow) {
    return (
      <NotFoundState
        icon={<FiLock className="w-5 h-5" />}
        message="Escrow not found."
      />
    );
  }

  const listing = escrow.listing;
  const buyer = escrow.buyer;
  const seller = escrow.seller;

  const productImages = listing
    ? [
        ...listing.images.map((img) => ({
          id: img.publicId,
          url: img.secureUrl || img.url,
        })),
        ...(listing.video
          ? [
              {
                id: listing.video.publicId,
                url: listing.video.secureUrl || listing.video.url,
                posterUrl: (listing.video.secureUrl || listing.video.url).replace(
                  /\.[^.]+$/,
                  ".jpg",
                ),
                isVideo: true,
              },
            ]
          : []),
      ]
    : [];

  const moreActions: RowAction[] = [];

  if (escrow.transaction) {
    const reference = escrow.transaction.reference;
    moreActions.push({
      label: "View Transaction",
      icon: <FiEye className="w-4 h-4" />,
      onClick: () => navigate(`/transactions/${reference}`),
    });
  }
  if (listing) {
    moreActions.push({
      label: "View Item",
      icon: <FiEye className="w-4 h-4" />,
      onClick: () => navigate(`/listings/${listing.slug}`),
    });
  }
  if (buyer) {
    moreActions.push({
      label: "View Buyer Profile",
      icon: <FiUser className="w-4 h-4" />,
      onClick: () => navigate(`/users/${buyer.id}`),
    });
  }
  if (seller) {
    moreActions.push({
      label: "View Seller Profile",
      icon: <FiUser className="w-4 h-4" />,
      onClick: () => navigate(`/users/${seller.id}`),
    });
  }
  if (buyer) {
    moreActions.push({
      label: "Contact Buyer",
      icon: <FiMail className="w-4 h-4" />,
      onClick: () => {
        window.location.href = `mailto:${buyer.email}`;
      },
    });
  }
  if (seller) {
    moreActions.push({
      label: "Contact Seller",
      icon: <FiMail className="w-4 h-4" />,
      onClick: () => {
        window.location.href = `mailto:${seller.email}`;
      },
    });
  }

  // if (escrow.status !== "refunded" && escrow.status !== "released") {
  //   moreActions.push({
  //     label: "Refund",
  //     icon: <HiOutlineReceiptRefund className="w-4 h-4" />,
  //     variant: "danger",
  //     onClick: () =>
  //       showToast.error("Refund isn't wired up yet", {
  //         description: "There's no refund endpoint available for escrows yet.",
  //       }),
  //   });
  // }

  return (
    <div className="print-area">
      {/* breadcrumb */}
      <button
        onClick={() => navigate("/escrows")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Escrows
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl px-4 py-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#1D2939] dark:text-gray-100">
              {escrow.slug}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                badgeClass[escrow.status] ?? statusFallback
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {formatLabel(escrow.status)}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {escrow.transaction?.reference ?? "No linked transaction"} · Created{" "}
            {formatDateTime(escrow.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            leftIcon={<FiPrinter className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <RowActionsMenu
            actions={moreActions}
            menuWidth={200}
            triggerClassName="w-9 h-9 rounded-full dark:text-white border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800"
          />
        </div>
      </div>

      {/* status banner */}
      {escrow.status === "released" && (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#D0FAE5] dark:bg-green-900 rounded-full flex items-center justify-center p-3 shrink-0">
              <FaCheckCircle className="w-6 h-6 text-[#039855] dark:text-green-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                Funds have been successfully released to the seller
              </p>
              <p className="text-xs text-brand-gray-light dark:text-gray-400">
                Settlement completed. The seller has been paid.
              </p>
            </div>
          </div>
          <div className="text-right text-xs min-w-55">
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Released On</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {formatDateTime(escrow.updatedAt)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Payment Reference</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.paymentDetails.paymentReference}
              </span>
            </div>
          </div>
        </div>
      )}

      {escrow.status === "refunded" && (
        <div className="flex items-center justify-between bg-[#F5F3FF] dark:bg-purple-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#EDE9FE] dark:bg-purple-900 rounded-full flex items-center justify-center p-3 shrink-0">
              <TbRotate2 className="w-6 h-6 text-[#7F22FE] dark:text-purple-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                Funds have been refunded to the buyer
              </p>
              <p className="text-xs text-brand-gray-light dark:text-gray-400">
                The escrow has been closed and the buyer has been reimbursed.
              </p>
            </div>
          </div>
          <div className="text-right text-xs min-w-55">
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Refund Date</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {formatDateTime(escrow.refundInfo?.refundedAt)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Refund Amount</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {currency.format(escrow.refundInfo?.amount ?? escrow.amount)}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Refund Reference</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.refundInfo?.reference ?? "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {escrow.status === "held" && (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#DBEAFE] dark:bg-blue-900 rounded-full flex items-center justify-center p-3 shrink-0">
              <RiLock2Fill className="w-6 h-6 text-brand-blue dark:text-blue-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                Funds are securely held in escrow
              </p>
              <p className="text-xs text-brand-gray-light dark:text-gray-400">
                Awaiting buyer inspection and confirmation before settlement.
              </p>
            </div>
          </div>
          <div className="text-right text-xs min-w-55">
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Holding Duration</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.insights.holdingDuration}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Current Stage</span>
              <span className="font-medium text-brand-blue">
                {escrow.insights.currentStage}
              </span>
            </div>
          </div>
        </div>
      )}

      {escrow.status === "frozen" && (
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFE2E2] dark:bg-red-900 rounded-full flex items-center justify-center p-3 shrink-0">
              <img src={frozen} className="w-6 h-6" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                This escrow is temporarily frozen
              </p>
              <p className="text-xs text-brand-gray-light dark:text-gray-400">
                Declut is currently reviewing this transaction. Funds are
                secured.
              </p>
            </div>
          </div>
          <div className="text-right text-xs min-w-55">
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Dispute Status</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {escrow.disputeInfo ? formatLabel(escrow.disputeInfo.status) : "—"}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Frozen Since</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {formatDateTime(escrow.disputeInfo?.createdAt ?? escrow.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {currency.format(escrow.insights.amountHeld)}
          </p>
          <p className="detail-stat-label">
            <AiFillDollarCircle className="w-3.5 h-3.5" /> Amount Held
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {currency.format(escrow.insights.platformCommission)}
          </p>
          <p className="detail-stat-label">
            <FaWallet className="w-3.5 h-3.5" />
            Platform Commission
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {currency.format(escrow.insights.sellerReceivable)}
          </p>
          <p className="detail-stat-label">
            <FaUser className="w-3.5 h-3.5" />
            Seller Receivable
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">{escrow.insights.holdingDuration}</p>
          <p className="detail-stat-label">
            <HiClock className="w-3.5 h-3.5" />
            Holding Duration
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">{escrow.insights.currentStage}</p>
          <p className="detail-stat-label">
            <img src={layers} className="w-4 h-4" /> Current Stage
          </p>
        </div>
      </div>

      {/* tabs */}
      <div className="flex items-center gap-5">
        {tabsList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold ${activeTab === tab ? "text-brand-blue" : "text-brand-gray-light hover:text-brand-gray-dark"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Product Information
              </p>
              {listing ? (
                <>
                  <ImageGallery images={productImages} />
                  <p className="text-base font-semibold text-brand-gray-dark dark:text-gray-100 mt-3">
                    {listing.title}
                  </p>
                  <p className="text-xs text-brand-gray-light mb-3">
                    {listing.category?.title ?? "—"}
                  </p>

                  <div className="flex flex-col">
                    <div className="profile-info-row">
                      <span className="profile-info-label">Brand</span>
                      <span className="profile-info-value">
                        {listing.brand ?? "—"}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Condition</span>
                      <span className="profile-info-value">
                        {formatLabel(listing.condition)}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Price</span>
                      <span className="profile-info-value">
                        {currency.format(listing.price)}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Location</span>
                      <span className="profile-info-value">
                        {listing.locationLabel}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Listing ID</span>
                      <button
                        onClick={() => navigate(`/listings/${listing.slug}`)}
                        className="text-brand-blue hover:underline-wavy cursor-pointer"
                      >
                        {listing.slug}
                      </button>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Listing Status</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                        {formatLabel(listing.status)}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Listed On</span>
                      <span className="profile-info-value">
                        {formatDate(listing.createdAt)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mt-4 mb-1 border-t border-gray-100 dark:border-gray-800 pt-3">
                    Description
                  </p>
                  <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                    {listing.description}
                  </p>

                  {listing.hasDefect && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-1">
                        Seller's Defect Summary
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 rounded-lg px-3 py-2">
                        {listing.defectDescription ??
                          "Seller flagged a defect but didn't provide a description."}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-brand-gray-light">
                  The listing for this escrow is no longer available.
                </p>
              )}
            </div>

            {/* Parties */}
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Parties
              </p>
              {[buyer, seller].filter(Boolean).map((party) => (
                <div
                  key={party!.id}
                  className="flex items-center justify-between gap-2.5 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={avatarPlaceholder}
                      alt={party!.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                          {party!.name}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                          {formatLabel(party!.status)}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${party!.rolePlayed === "seller" ? "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950" : "text-[#7F22FE] bg-[#F5F3FF] dark:text-purple-400 dark:bg-purple-950"}`}
                        >
                          {formatLabel(party!.rolePlayed)}
                        </span>
                      </div>
                      <p className="text-xs text-brand-gray-light">
                        {party!.slug} · {party!.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => (window.location.href = `mailto:${party!.email}`)}
                    className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-brand-gray-light hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  >
                    <FiMail className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {!buyer && !seller && (
                <p className="text-sm text-brand-gray-light">
                  No party information available.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <PlatformEarningsCard earnings={escrow.platformEarning} />

            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
                Linked Transaction
              </p>
              {escrow.transaction ? (
                <>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Reference</span>
                    <span className="profile-info-value">
                      {escrow.transaction.reference}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Status</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        badgeClass[escrow.transaction.status] ?? statusFallback
                      }`}
                    >
                      {formatLabel(escrow.transaction.status)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/transactions/${escrow.transaction!.reference}`)
                    }
                    className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg hover:bg-[#93C5FD] mt-3 cursor-pointer"
                  >
                    View Full Transaction Record
                  </button>
                </>
              ) : (
                <p className="text-sm text-brand-gray-light">
                  No transaction is linked to this escrow.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RECORDS */}
      {activeTab === "Records" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Dispute Details
              </p>
              {!escrow.disputeInfo ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <FaCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </span>
                  <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                    No Dispute Raised
                  </p>
                  <p className="text-xs text-brand-gray-light max-w-xs">
                    No dispute has been filed for this escrow.
                  </p>
                </div>
              ) : (
                <>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Dispute ID</span>
                    <button
                      onClick={() =>
                        navigate(`/reports/${escrow.disputeInfo!.slug}`)
                      }
                      className="text-brand-blue hover:underline-wavy cursor-pointer"
                    >
                      {escrow.disputeInfo.slug}
                    </button>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Status</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        badgeClass[escrow.disputeInfo.status] ?? statusFallback
                      }`}
                    >
                      {formatLabel(escrow.disputeInfo.status)}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Opened</span>
                    <span className="profile-info-value">
                      {formatDateTime(escrow.disputeInfo.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mt-3 mb-1">
                    Reason
                  </p>
                  <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                    {escrow.disputeInfo.reason}
                  </p>
                  <button
                    onClick={() =>
                      navigate(`/reports/${escrow.disputeInfo!.slug}`)
                    }
                    className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg hover:bg-[#93C5FD] mt-3 cursor-pointer"
                  >
                    View Full Dispute Record
                  </button>
                </>
              )}
            </div>

            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Refund Details
              </p>
              {!escrow.refundInfo ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <FaCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </span>
                  <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                    No Refund Requested
                  </p>
                  <p className="text-xs text-brand-gray-light max-w-xs">
                    No refund has been initiated for this escrow transaction.
                  </p>
                </div>
              ) : (
                <>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund ID</span>
                    <span className="profile-info-value">
                      {escrow.refundInfo.slug}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Reason</span>
                    <span className="profile-info-value">
                      {escrow.refundInfo.reason}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Amount</span>
                    <span className="profile-info-value">
                      {currency.format(escrow.refundInfo.amount)}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Status</span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        badgeClass[escrow.refundInfo.status] ?? statusFallback
                      }`}
                    >
                      {formatLabel(escrow.refundInfo.status)}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Triggered By</span>
                    <span className="profile-info-value">
                      {escrow.refundInfo.triggeredBy.name}
                      {escrow.refundInfo.triggeredBy.rolePlayed
                        ? ` (${formatLabel(escrow.refundInfo.triggeredBy.rolePlayed)})`
                        : ""}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Date</span>
                    <span className="profile-info-value">
                      {formatDateTime(escrow.refundInfo.refundedAt)}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Reference</span>
                    <span className="profile-info-value">
                      {escrow.refundInfo.reference}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Payout Account</span>
                    <span className="profile-info-value">
                      {escrow.refundInfo.payoutAccountNumber}
                      {escrow.refundInfo.payoutBankCode
                        ? ` (Bank ${escrow.refundInfo.payoutBankCode})`
                        : ""}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Financial breakdown */}
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
                Financial Breakdown
              </p>
              <div className="profile-info-row">
                <span className="profile-info-label">Item Price</span>
                <span className="profile-info-value">
                  {currency.format(escrow.financialBreakdown.itemPrice)}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">
                  Platform Fee ({escrow.financialBreakdown.platformFeePercentage}%)
                </span>
                <span className="text-red-500">
                  – {currency.format(escrow.financialBreakdown.platformFee)}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">
                  Payment Processing Fee (
                  {escrow.financialBreakdown.processingFeePercentage}%)
                </span>
                <span className="text-red-500">
                  – {currency.format(escrow.financialBreakdown.processingFee)}
                </span>
              </div>
              <div className="profile-info-row bg-gray-50 dark:bg-gray-800/50 -mx-2 px-2 rounded">
                <span className="profile-info-label">Total Paid by Buyer</span>
                <span className="profile-info-value">
                  {currency.format(escrow.financialBreakdown.totalPaidByBuyer)}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Seller Receivable</span>
                <span className="text-sm font-semibold text-green-600">
                  {currency.format(escrow.financialBreakdown.sellerReceivable)}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Refund Amount</span>
                <span
                  className={
                    escrow.financialBreakdown.refundAmount
                      ? "text-sm font-semibold text-amber-600"
                      : "profile-info-value"
                  }
                >
                  {escrow.financialBreakdown.refundAmount
                    ? currency.format(escrow.financialBreakdown.refundAmount)
                    : "—"}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Net Settlement</span>
                <span className="text-sm font-semibold text-green-600">
                  {currency.format(escrow.financialBreakdown.netSettlement)}
                </span>
              </div>
            </div>
          </div>

          <PlatformEarningsCard earnings={escrow.platformEarning} />
        </div>
      )}

      {/* SETTLEMENT */}
      {activeTab === "Settlement" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
                Payment Details
              </p>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Reference</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.paymentReference}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Gateway</span>
                <span className="profile-info-value">
                  {formatLabel(escrow.paymentDetails.paymentGateway)}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Method</span>
                <span className="profile-info-value">
                  {formatLabel(escrow.paymentDetails.paymentMethod)}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Status</span>
                <span className="text-sm font-medium text-green-600">
                  {escrow.paymentDetails.paymentStatus}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Currency</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.currency}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Date</span>
                <span className="profile-info-value">
                  {formatDate(escrow.paymentDetails.paymentDate)}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Time</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.paymentTime}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Gateway Response</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.gatewayResponse}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Gateway Reference</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.gatewayReference}
                </span>
              </div>
            </div>

            {/* <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
                Settlement Details
              </p>
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <span className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <FaClock className="w-5 h-5 text-brand-gray-dark dark:text-gray-400" />
                </span>
                <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                  No Settlement Data Yet
                </p>
                <p className="text-xs text-brand-gray-light max-w-xs">
                  Settlement details aren't returned by the backend for
                  escrows yet.
                </p>
              </div>
            </div> */}
          </div>

          <PlatformEarningsCard earnings={escrow.platformEarning} />
        </div>
      )}

      {/* NOTES & LOGS */}
      {activeTab === "Notes & Logs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Internal Notes
              </p>
              <div className="flex flex-col gap-2">
                {escrow.transactionNotes.length === 0 ? (
                  <p className="text-sm text-brand-gray-light">
                    No internal notes yet.
                  </p>
                ) : (
                  escrow.transactionNotes.map((note) => (
                    <div
                      key={note.id}
                      className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                          {note.writtenBy?.name ?? "Admin"}
                        </p>
                        <span className="text-xs text-brand-gray-light">
                          {formatDateTime(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-1">
                        {note.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Activity Log
              </p>
              <div className="flex flex-col">
                {escrow.activityLog.length === 0 && (
                  <p className="text-sm text-brand-gray-light">
                    No activity recorded yet.
                  </p>
                )}
                {escrow.activityLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm text-brand-gray-dark dark:text-gray-200">
                        {entry.label}
                      </p>
                      <p className="text-xs text-brand-gray-light">
                        {entry.actor.name} · {formatLabel(entry.actor.role)}
                      </p>
                    </div>
                    <span className="text-xs text-brand-gray-light shrink-0">
                      {entry.slug}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <PlatformEarningsCard earnings={escrow.platformEarning} />
        </div>
      )}
    </div>
  );
}
