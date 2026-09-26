import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import type { ReferralRewardListItem } from "../types";

interface ViewRewardModalProps {
  reward: ReferralRewardListItem;
  onClose: () => void;
}

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatWord(word: string) {
  return word
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const paymentPillClass: Record<string, string> = {
  pending: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  paid: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  canceled: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
};

const paymentFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

export default function ViewRewardModal({
  reward,
  onClose,
}: ViewRewardModalProps) {
  return (
    <BaseModal
      title="Reward Details"
      onClose={onClose}
      width="max-w-xl"
      footer={
        <Button
          onClick={onClose}
          bgColor="bg-white dark:bg-gray-900"
          textColor="text-brand-gray-dark dark:text-gray-200"
          borderColor="border-gray-200 dark:border-gray-700"
        >
          Close
        </Button>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
          Reward Information
        </p>

        <div className="profile-info-row">
          <span className="profile-info-label">Participant</span>
          <span className="profile-info-value">
            {reward.participant?.name ?? "—"}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Campaign</span>
          <span className="profile-info-value">
            {reward.campaign?.name ?? "—"}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Reward</span>
          <span className="profile-info-value">
            {currency.format(reward.reward)}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Qualified On</span>
          <span className="profile-info-value">
            {formatDate(reward.qualifiedOn)}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Payment</span>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              paymentPillClass[reward.payment] ?? paymentFallback
            }`}
          >
            {formatWord(reward.payment)}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Schedule</span>
          <span className="profile-info-value">
            {formatWord(reward.schedule)}
          </span>
        </div>
      </div>
    </BaseModal>
  );
}
