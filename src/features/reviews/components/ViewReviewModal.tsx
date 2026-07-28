import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import StarRating from "@/components/generic/StarRating";
import avatarPlaceholder from "@/assets/avatar.svg";
import { BsCheckCircle } from "react-icons/bs";
import type { ReviewRow } from "../types";

interface ViewReviewModalProps {
  review: ReviewRow;
  onClose: () => void;
  onResolve: () => void;
}

export default function ViewReviewModal({
  review,
  onClose,
  onResolve,
}: ViewReviewModalProps) {
  return (
    <BaseModal
      title="Review"
      onClose={onClose}
      width="max-w-xl"
      footer={
        <>
          <Button
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            View Transaction
          </Button>
          <Button
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            View on Listing
          </Button>
          {review.status === "Flagged" && (
            <Button
              leftIcon={<BsCheckCircle className="w-4 h-4" />}
              onClick={onResolve}
              bgColor="bg-green-600 hover:bg-green-700"
              textColor="text-white"
              borderColor="border-transparent"
            >
              Resolve
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
              review.status === "Flagged"
                ? "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950"
                : "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950"
            }
          >
            {review.status}
          </span>
        </div>

        <div className="flex items-center gap-2.5 mb-2">
          <img
            src={review.reviewerAvatarUrl || avatarPlaceholder}
            alt={review.reviewerName}
            className="w-9 h-9 rounded-full object-cover"
          />
          <div>
            <a
              href="#"
              className="text-sm text-brand-blue hover:underline-wavy"
            >
              {review.reviewerName}
            </a>
            <p className="text-xs text-brand-gray-light">
              {review.reviewerId} · {review.reviewerEmail} ·{" "}
              {review.reviewerCompany}
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
          src={review.listingImageUrl || avatarPlaceholder}
          alt={review.listingName}
          className="w-12 h-12 rounded-lg object-cover shrink-0"
        />
        <div>
          <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
            {review.listingName}
          </p>
          <p className="text-xs text-brand-gray-light">
            {review.listingCode} · Submitted {review.listingSubmittedDate}
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
