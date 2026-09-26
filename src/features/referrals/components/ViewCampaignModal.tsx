import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import { FiEdit3 } from "react-icons/fi";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import { useReferralCampaign } from "../queries";
import type { ReferralCampaign } from "../types";

interface ViewCampaignModalProps {
  campaignId: string;
  onClose: () => void;
  onEdit: (campaign: ReferralCampaign) => void;
}

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatDate(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatWord(word: string) {
  return word
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="campaign-review-section-title">{title}</p>
      <div className="campaign-review-section-body">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="campaign-review-row">
      <span className="campaign-review-label">{label}</span>
      <span className="campaign-review-value">{value}</span>
    </div>
  );
}

function CampaignDetails({ campaign }: { campaign: ReferralCampaign }) {
  const requirement = campaign.referralRequirement;
  const rules = campaign.validationRules;

  const activeRules = (
    [
      ["Transaction Completed", rules.transactionCompleted],
      ["Escrow Released", rules.escrowReleased],
      ["Not Refunded", rules.notRefunded],
      ["Not Disputed", rules.notDisputed],
      ["Not Flagged as Fraud", rules.notFlagged],
      ["Meets Minimum Transaction Amount", rules.meetsMinimumTransactionAmount],
    ] as const
  )
    .filter(([, active]) => active)
    .map(([label]) => label);

  return (
    <div className="flex flex-col gap-4">
      <Section title="Overview">
        <Row label="Internal Code" value={campaign.internalCampaignCode} />
        <Row label="Campaign Name" value={campaign.name} />
        <Row label="Description" value={campaign.description || "—"} />
        <Row label="Status" value={formatWord(campaign.status)} />
        <Row label="Start Date" value={formatDate(campaign.startDate)} />
        <Row label="End Date" value={formatDate(campaign.endDate)} />
        {campaign.status === "scheduled" && (
          <>
            <Row
              label="Activation Date"
              value={formatDate(campaign.activationDate)}
            />
            <Row
              label="Activation Time"
              value={campaign.activationTime ?? "—"}
            />
          </>
        )}
      </Section>

      <Section title="Reward">
        <Row label="Reward Type" value={formatWord(campaign.rewardType)} />
        <Row
          label="Reward Amount"
          value={currency.format(campaign.rewardAmount)}
        />
        <Row
          label="Max. Campaign Budget"
          value={currency.format(campaign.maxCampaignBudget)}
        />
      </Section>

      <Section title="Referral Requirements">
        <Row
          label="Successful Referrals Required"
          value={String(requirement.referralAmount)}
        />
        <Row
          label="What must each referred user do?"
          value={requirement.eachReferredTask.map(formatWord).join(", ") || "—"}
        />
        <Row
          label="Min. Value — Completed Sale"
          value={currency.format(
            requirement.minimumTransactionValueCompletedSale,
          )}
        />
        <Row
          label="Min. Value — Completed Transaction"
          value={currency.format(
            requirement.minimumTransactionValueCompletedTransaction,
          )}
        />
      </Section>

      <Section title="Time Rules">
        <Row
          label="Qualification Window"
          value={`${campaign.qualificationWindow} Days`}
        />
      </Section>

      <Section title="Eligibility">
        <Row
          label="Eligible Users"
          value={formatWord(campaign.eligibility.eligibleUsers)}
        />
        <Row
          label="Eligible Location"
          value={formatWord(campaign.eligibility.eligibleLocation)}
        />
      </Section>

      <Section title="Validation Rules">
        <Row label="Rules" value={activeRules.join(", ") || "None"} />
      </Section>

      <Section title="Payout Rules">
        <Row label="Payout Method" value={formatWord(campaign.paymentMethod)} />
        <Row
          label="Payment Schedule"
          value={formatWord(campaign.paymentSchedule)}
        />
      </Section>

      <Section title="Audit">
        <Row label="Created By" value={campaign.createdBy?.name ?? "—"} />
        <Row label="Created At" value={formatDateTime(campaign.createdAt)} />
        <Row label="Last Updated" value={formatDateTime(campaign.updatedAt)} />
        <Row
          label="Updated By"
          value={
            campaign.updatedBy.length
              ? campaign.updatedBy.map((u) => u.name).join(", ")
              : "—"
          }
        />
      </Section>
    </div>
  );
}

export default function ViewCampaignModal({
  campaignId,
  onClose,
  onEdit,
}: ViewCampaignModalProps) {
  const { data: campaign, isLoading, isError, error } =
    useReferralCampaign(campaignId);

  return (
    <BaseModal
      title={campaign ? `${campaign.name} Review` : "Campaign Review"}
      subtitle="This action updates the related campaign, participant, payout, or risk record and creates an audit entry."
      onClose={onClose}
      width="max-w-2xl"
      footer={
        <>
          <Button
            onClick={onClose}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            Close
          </Button>
          {campaign && (
            <Button
              leftIcon={<FiEdit3 className="w-4 h-4" />}
              onClick={() => onEdit(campaign)}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
            >
              Edit
            </Button>
          )}
        </>
      }
    >
      {isLoading && (
        <div className="detail-empty-state">Loading campaign details...</div>
      )}
      {isError && (
        <div className="detail-empty-state">
          {getApiErrorMessage(error, "Couldn't load this campaign.")}
        </div>
      )}
      {campaign && <CampaignDetails campaign={campaign} />}
    </BaseModal>
  );
}
