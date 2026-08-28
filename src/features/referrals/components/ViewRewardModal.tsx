import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import type { Reward } from "../types";

interface ViewRewardModalProps {
  reward: Reward;
  onClose: () => void;
}

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function ViewRewardModal({
  reward,
  onClose,
}: ViewRewardModalProps) {
  return (
    <BaseModal
      title="Reward Details"
      subtitle="This change is recorded in the audit log and related timelines."
      onClose={onClose}
      width="max-w-2xl"
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
          Reward Details
        </p>

        <div className="profile-info-row">
          <span className="profile-info-label">ID</span>
          <span className="profile-info-value">{reward.id}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Participant</span>
          <span className="profile-info-value">{reward.participant}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Campaign Name</span>
          <span className="profile-info-value">{reward.campaign}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Reward</span>
          <span className="text-sm text-brand-blue">
            {currency.format(reward.reward)}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Payment Schedule</span>
          <span className="profile-info-value">{reward.schedule}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Qualified On</span>
          <span className="profile-info-value">
            {formatDate(reward.qualifiedOn)}
          </span>
        </div>
      </div>
    </BaseModal>
  );
}