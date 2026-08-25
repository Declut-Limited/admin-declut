import { useNavigate } from "react-router-dom";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import StarRating from "@/components/generic/StarRating";
import avatarPlaceholder from "@/assets/avatar.svg";
import { BsCheckCircle } from "react-icons/bs";
import type { ReviewRow } from "../types";
import { FiFlag } from "react-icons/fi";

interface ViewReviewModalProps {
  review: ReviewRow;
  isSubmitting?: boolean;
  onClose: () => void;
  onResolve: () => void;
  onFlag: () => void;
}

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

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ViewReviewModal({
  review,
  isSubmitting,
  onClose,
  onResolve,
  onFlag,
}: ViewReviewModalProps) {
  const navigate = useNavigate();
  const { reviewer, listing } = review;
  const isFlagged = review.status === "flagged";

  return (
    <BaseModal
      title="Review"
      onClose={onClose}
      width="max-w-xl"
      footer={
        <>
          <Button
            onClick={() => navigate(`/transactions/${review.transaction}`)}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            View Transaction
          </Button>
          <Button
            onClick={() =>
              listing && navigate(`/listings/${listing.slug ?? listing.id}`)
            }
            disabled={!listing}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            View on Listing
          </Button>
          {isFlagged ? (
            <Button
              leftIcon={<BsCheckCircle className="w-4 h-4" />}
              onClick={onResolve}
              disabled={isSubmitting}
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              borderColor="border-transparent"
            >
              {isSubmitting ? "Resolving..." : "Resolve"}
            </Button>
          ) : (
            <Button
              leftIcon={<FiFlag className="w-4 h-4" />}
              onClick={onFlag}
              disabled={isSubmitting}
              bgColor="bg-[#FFFBFA] dark:bg-gray-900"
              textColor="text-[#F04438]"
              borderColor="border-[#F04438] dark:border-red-900"
            >
              {isSubmitting ? "Flagging..." : "Flag"}
            </Button>
          )}
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
            Reviewer
          </p>
          <span
            className={
              review.status === "flagged"
                ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950"
                : "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950"
            }
          >
            {formatStatus(review.status)}
          </span>
        </div>

        <div className="flex items-center gap-2.5 mb-2">
          <span
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
          >
            {reviewer ? getInitials(reviewer.name) : "—"}
          </span>
          <div>
            <button
              type="button"
              onClick={() => reviewer && navigate(`/users/${reviewer.id}`)}
              className="text-sm text-brand-blue hover:underline-wavy cursor-pointer"
            >
              {reviewer?.name ?? "—"}
            </button>
            <p className="text-xs text-brand-gray-light">
              {reviewer?.slug ?? "—"} · {reviewer?.email ?? "—"} ·{" "}
              {formatStatus(review.role)}
            </p>
          </div>
        </div>

        <StarRating rating={review.rating} />
        <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-1.5">
          {review.comment}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <img
          src={listing?.mainImage || avatarPlaceholder}
          alt={listing?.title ?? ""}
          className="w-12 h-12 rounded-lg object-cover shrink-0"
        />
        <div>
          <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
            {listing?.title ?? "—"}
          </p>
          <p className="text-xs text-brand-gray-light">
            {listing?.slug ?? "—"} · Submitted{" "}
            {listing ? formatDate(listing.createdAt) : "—"}
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
