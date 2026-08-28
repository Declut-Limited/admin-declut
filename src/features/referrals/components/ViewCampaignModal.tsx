import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import type { Campaign } from "../types";

interface ViewCampaignModalProps {
  campaign: Campaign;
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

export default function ViewCampaignModal({
  campaign,
  onClose,
}: ViewCampaignModalProps) {
  return (
    <BaseModal
      title={`${campaign.name} Review`}
      subtitle="This action updates the related campaign, participant, payout, or risk record and creates an audit entry."
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
          Campaign Details
        </p>

        <div className="profile-info-row">
          <span className="profile-info-label">ID</span>
          <span className="profile-info-value">{campaign.code}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Campaign Name</span>
          <span className="text-sm text-brand-blue">{campaign.name}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Reward</span>
          <span className="profile-info-value">
            {currency.format(campaign.reward)}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Requirement</span>
          <span className="profile-info-value">{campaign.requirement}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Participants</span>
          <span className="profile-info-value">{campaign.participants}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Qualified</span>
          <span className="profile-info-value">{campaign.qualified}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Start Date</span>
          <span className="profile-info-value">{formatDate(campaign.from)}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">End Date</span>
          <span className="profile-info-value">{formatDate(campaign.to)}</span>
        </div>
      </div>
    </BaseModal>
  );
}