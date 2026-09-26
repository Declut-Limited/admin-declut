import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import FormInput from "@/components/generic/FormInput";
import FormTextarea from "@/components/generic/FormTextArea";
import CustomSelect from "@/components/generic/CustomSelect";
import MultiCheckboxSelect from "@/components/generic/MultiCheckboxSelect";
import DatePicker from "@/components/generic/DatePicker";
import PageLoader from "@/components/generic/PageLoader";
import ScheduleCampaignModal from "./ScheduleCampaignModal";
import { BsCheckCircleFill } from "react-icons/bs";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import { useReferralCampaign } from "../queries";
import type {
  CampaignFormData,
  CampaignStatus,
  ReferralCampaign,
  ReferralCampaignPayload,
  ReferralCampaignValidationRules,
} from "../types";

interface CreateCampaignModalProps {
  // when present, fetches the full campaign and edits it; omit to create new
  campaignId?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: ReferralCampaignPayload) => void;
}

interface CampaignWizardProps {
  campaign?: ReferralCampaign;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: ReferralCampaignPayload) => void;
}

const STEPS = [
  "Basic Information",
  "Reward",
  "Referral Requirements",
  // "Referrer Requirements", // no corresponding API field
  "Time Rules",
  "Eligibility",
  "Validation Rules",
  "Payout Rules",
  "Review & Publish",
] as const;

interface Option {
  label: string;
  value: string;
}

// Only "fixed_cash" is confirmed by the API for now.
const REWARD_TYPES: Option[] = [
  { label: "Fixed Cash Reward", value: "fixed_cash" },
  // { label: "Wallet Credit", value: "wallet_credit" }, // not supported by the API yet
];
const REFERRED_USER_ACTIONS: Option[] = [
  { label: "Complete Sale", value: "complete_sale" },
  { label: "Complete Transaction", value: "complete_transaction" },
];
// no corresponding API field — see the removed "Referrer Requirements" step below
// const TRANSACTION_TYPES = [
//   "Any Successful Transaction",
//   "Purchases Only",
//   "Sales Only",
// ];
// no corresponding API field — see the removed "Countdown Starts From" field below
// const COUNTDOWN_OPTIONS = [
//   "Campaign Start",
//   "Referrer's First Referral",
//   "First Referred Registration",
// ];
const ELIGIBLE_USERS: Option[] = [
  { label: "All Registered Users", value: "all_registered_users" },
  { label: "New Users Only", value: "new_users_only" },
  { label: "Existing Users", value: "existing_users" },
];
const GEO_OPTIONS: Option[] = [
  { label: "All Supported Locations", value: "all_supported_locations" },
  // { label: "Lagos", value: "lagos" },
  // { label: "Abuja", value: "abuja" },
  // { label: "Port Harcourt", value: "port_harcourt" },
];
const VALIDATION_RULES: { label: string; key: keyof ReferralCampaignValidationRules }[] = [
  { label: "Transaction Completed", key: "transactionCompleted" },
  { label: "Escrow released", key: "escrowReleased" },
  { label: "Not refunded", key: "notRefunded" },
  { label: "Not disputed", key: "notDisputed" },
  { label: "Not flagged as fraud", key: "notFlagged" },
  { label: "Meets minimum transaction amount", key: "meetsMinimumTransactionAmount" },
];
// Only "bank_transfer" is confirmed by the API for now.
const PAYMENT_METHODS: Option[] = [
  { label: "Bank Transfer", value: "bank_transfer" },
  // { label: "Wallet Credit", value: "wallet_credit" }, // not supported by the API yet
];
const PAYMENT_SCHEDULES: Option[] = [
  { label: "Weekly Batch", value: "weekly_batch" },
  { label: "Daily Batch", value: "daily_batch" },
  { label: "Immediately after approval", value: "immediately_after_approval" },
  { label: "Manual Batch", value: "manual_batch" },
];
const COUNT_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function labelOf(options: Option[]) {
  return options.map((o) => o.label);
}
function valueForLabel(options: Option[], label: string) {
  return options.find((o) => o.label === label)?.value;
}
function labelForValue(options: Option[], value: string) {
  return options.find((o) => o.value === value)?.label;
}

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const initialForm: CampaignFormData = {
  name: "",
  description: "",
  code: "",
  status: "Draft",
  startDate: "",
  endDate: "",
  rewardType: "",
  rewardAmount: "",
  maxBudget: "",
  referralsRequired: "",
  referredUserAction: "",
  minTransactionValue: "",
  useSeparateValues: false,
  minValueCompletedSale: "",
  minValueCompletedTransaction: "",
  qualificationWindow: "",
  eligibleUsers: "",
  geographicRestriction: "",
  validationRules: VALIDATION_RULES.map((r) => r.label),
  payoutMethod: "",
  paymentSchedule: "",
};

function isoDate(value: string) {
  if (!value) return "";
  return value.length > 10 ? value.slice(0, 10) : value;
}

function buildInitialState(campaign?: ReferralCampaign): {
  form: CampaignFormData;
  actions: string[];
} {
  if (!campaign) return { form: initialForm, actions: [] };

  const requirement = campaign.referralRequirement;
  const sameValue =
    requirement.minimumTransactionValueCompletedSale ===
    requirement.minimumTransactionValueCompletedTransaction;

  return {
    form: {
      name: campaign.name,
      description: campaign.description,
      code: campaign.internalCampaignCode,
      status: campaign.status,
      startDate: isoDate(campaign.startDate),
      endDate: isoDate(campaign.endDate),
      rewardType:
        labelForValue(REWARD_TYPES, campaign.rewardType) ?? campaign.rewardType,
      rewardAmount: String(campaign.rewardAmount ?? ""),
      maxBudget: String(campaign.maxCampaignBudget ?? ""),
      referralsRequired: String(requirement.referralAmount ?? ""),
      referredUserAction: "",
      minTransactionValue: String(
        requirement.minimumTransactionValueCompletedSale ?? "",
      ),
      useSeparateValues: !sameValue,
      minValueCompletedSale: String(
        requirement.minimumTransactionValueCompletedSale ?? "",
      ),
      minValueCompletedTransaction: String(
        requirement.minimumTransactionValueCompletedTransaction ?? "",
      ),
      qualificationWindow: String(campaign.qualificationWindow ?? ""),
      eligibleUsers:
        labelForValue(ELIGIBLE_USERS, campaign.eligibility.eligibleUsers) ??
        campaign.eligibility.eligibleUsers,
      geographicRestriction:
        labelForValue(GEO_OPTIONS, campaign.eligibility.eligibleLocation) ??
        campaign.eligibility.eligibleLocation,
      validationRules: VALIDATION_RULES.filter(
        (r) => campaign.validationRules[r.key],
      ).map((r) => r.label),
      payoutMethod:
        labelForValue(PAYMENT_METHODS, campaign.paymentMethod) ??
        campaign.paymentMethod,
      paymentSchedule:
        labelForValue(PAYMENT_SCHEDULES, campaign.paymentSchedule) ??
        campaign.paymentSchedule,
    },
    actions: requirement.eachReferredTask.map(
      (task) => labelForValue(REFERRED_USER_ACTIONS, task) ?? task,
    ),
  };
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function money(value: string) {
  const n = Number(value);
  return Number.isFinite(n) && value ? currency.format(n) : "—";
}

function buildPayload(
  form: CampaignFormData,
  actions: string[],
  status: CampaignStatus,
  schedule?: { date: string; time: string },
): ReferralCampaignPayload {
  const saleValue = Number(
    form.useSeparateValues ? form.minValueCompletedSale : form.minTransactionValue,
  );
  const transactionValue = Number(
    form.useSeparateValues
      ? form.minValueCompletedTransaction
      : form.minTransactionValue,
  );

  const validationRules = VALIDATION_RULES.reduce((acc, rule) => {
    acc[rule.key] = form.validationRules.includes(rule.label);
    return acc;
  }, {} as ReferralCampaignValidationRules);

  const payload: ReferralCampaignPayload = {
    name: form.name,
    description: form.description,
    internalCampaignCode: form.code,
    status,
    startDate: form.startDate ? `${form.startDate}T00:00:00.000Z` : "",
    endDate: form.endDate ? `${form.endDate}T23:59:59.000Z` : "",
    rewardType: valueForLabel(REWARD_TYPES, form.rewardType) ?? "fixed_cash",
    rewardAmount: Number(form.rewardAmount) || 0,
    maxCampaignBudget: Number(form.maxBudget) || 0,
    referralRequirement: {
      referralAmount: Number(form.referralsRequired) || 0,
      eachReferredTask: actions.map(
        (label) => valueForLabel(REFERRED_USER_ACTIONS, label) ?? label,
      ),
      minimumTransactionValueCompletedSale: Number.isFinite(saleValue)
        ? saleValue
        : 0,
      minimumTransactionValueCompletedTransaction: Number.isFinite(
        transactionValue,
      )
        ? transactionValue
        : 0,
    },
    qualificationWindow: Number(form.qualificationWindow) || 0,
    eligibility: {
      eligibleUsers:
        valueForLabel(ELIGIBLE_USERS, form.eligibleUsers) ??
        "all_registered_users",
      eligibleLocation:
        valueForLabel(GEO_OPTIONS, form.geographicRestriction) ??
        "all_supported_locations",
    },
    validationRules,
    paymentMethod:
      valueForLabel(PAYMENT_METHODS, form.payoutMethod) ?? "bank_transfer",
    paymentSchedule:
      valueForLabel(PAYMENT_SCHEDULES, form.paymentSchedule) ?? "weekly_batch",
  };

  if (status === "scheduled" && schedule) {
    payload.activationDate = `${schedule.date}T00:00:00.000Z`;
    payload.activationTime = schedule.time;
  }

  return payload;
}

export default function CreateCampaignModal({
  campaignId,
  isSubmitting,
  onClose,
  onSubmit,
}: CreateCampaignModalProps) {
  const {
    data: campaign,
    isLoading,
    isError,
    error,
  } = useReferralCampaign(campaignId);

  if (campaignId && isLoading) {
    return (
      <BaseModal title="Edit Campaign" onClose={onClose} width="max-w-5xl">
        <div className="py-20">
          <PageLoader />
        </div>
      </BaseModal>
    );
  }

  if (campaignId && (isError || !campaign)) {
    return (
      <BaseModal title="Edit Campaign" onClose={onClose} width="max-w-5xl">
        <div className="detail-empty-state">
          {getApiErrorMessage(error, "Couldn't load this campaign.")}
        </div>
      </BaseModal>
    );
  }

  return (
    <CampaignWizard
      campaign={campaign}
      isSubmitting={isSubmitting}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function CampaignWizard({
  campaign,
  isSubmitting,
  onClose,
  onSubmit,
}: CampaignWizardProps) {
  const [step, setStep] = useState(0);
  const [{ form: initial, actions: initialActions }] = useState(() =>
    buildInitialState(campaign),
  );
  const [form, setForm] = useState<CampaignFormData>(initial);
  const [actions, setActions] = useState<string[]>(initialActions);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const isEditing = Boolean(campaign);

  const set = <K extends keyof CampaignFormData>(
    key: K,
    value: CampaignFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const includesSale = actions.includes("Complete Sale");
  const includesTransaction = actions.includes("Complete Transaction");

  const toggleValidationRule = (rule: string) => {
    set(
      "validationRules",
      form.validationRules.includes(rule)
        ? form.validationRules.filter((r) => r !== rule)
        : [...form.validationRules, rule],
    );
  };

  const handlePublish = () => {
    onSubmit(buildPayload(form, actions, "published"));
  };

  const handleSaveDraft = () => {
    onSubmit(buildPayload(form, actions, "draft"));
  };

  const handleSchedule = (schedule: { date: string; time: string }) => {
    onSubmit(buildPayload(form, actions, "scheduled", schedule));
    setScheduleOpen(false);
  };

  return (
    <>
      <BaseModal
        title={isEditing ? "Edit Campaign" : "Create Campaign"}
        onClose={onClose}
        width="max-w-5xl"
        footer={
          step === STEPS.length - 1 ? (
            <>
              <Button
                onClick={() => setStep((s) => s - 1)}
                bgColor="bg-white dark:bg-gray-900"
                textColor="text-brand-gray-dark dark:text-gray-200"
                borderColor="border-gray-200 dark:border-gray-700"
                className="mr-auto"
              >
                Back
              </Button>
              <Button
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                bgColor="bg-white dark:bg-gray-900"
                textColor="text-brand-gray-dark dark:text-gray-200"
                borderColor="border-gray-200 dark:border-gray-700"
              >
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </Button>
              <Button
                onClick={() => setScheduleOpen(true)}
                disabled={isSubmitting}
                bgColor="bg-white dark:bg-gray-900"
                textColor="text-brand-gray-dark dark:text-gray-200"
                borderColor="border-gray-200 dark:border-gray-700"
              >
                Schedule
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isSubmitting}
                bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
                textColor="text-white"
                borderColor="border-transparent"
              >
                {isSubmitting ? "Publishing..." : "Publish Campaign"}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
                bgColor="bg-white dark:bg-gray-900"
                textColor="text-brand-gray-dark dark:text-gray-200"
                borderColor="border-gray-200 dark:border-gray-700"
              >
                {step === 0 ? "Cancel" : "Back"}
              </Button>
              <Button
                onClick={() => setStep((s) => s + 1)}
                bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
                textColor="text-white"
                borderColor="border-transparent"
              >
                Continue
              </Button>
            </>
          )
        }
      >
        <div className="campaign-wizard">
          <nav className="campaign-wizard-steps">
            {STEPS.map((label, index) => {
              const isDone = index < step;
              const isCurrent = index === step;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => index <= step && setStep(index)}
                  className={`campaign-wizard-step ${isCurrent ? "campaign-wizard-step-active" : ""}`}
                >
                  <span
                    className={`campaign-wizard-step-badge ${
                      isDone
                        ? "campaign-wizard-step-badge-done"
                        : isCurrent
                          ? "campaign-wizard-step-badge-current"
                          : ""
                    }`}
                  >
                    {isDone ? (
                      <BsCheckCircleFill className="w-3.5 h-3.5" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={
                      isDone || isCurrent
                        ? "text-brand-blue font-medium"
                        : "text-brand-gray-light"
                    }
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="campaign-wizard-content">
            {step === 0 && (
              <div className="campaign-wizard-panel">
                <FormInput
                  label="Campaign Name"
                  required
                  placeholder="e.g. Holiday Marketplace Boost"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                <FormTextarea
                  label="Description"
                  required
                  rows={4}
                  placeholder="What is the campaign designed to achieve?"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <DatePicker
                    label="Start Date"
                    value={form.startDate}
                    onChange={(v) => set("startDate", v)}
                  />
                  <DatePicker
                    label="End Date"
                    value={form.endDate}
                    onChange={(v) => set("endDate", v)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Internal Campaign Code"
                    placeholder="HOLIDAY-26"
                    value={form.code}
                    onChange={(e) => set("code", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="campaign-wizard-panel">
                <CustomSelect
                  label="Reward Type"
                  required
                  value={form.rewardType || "e.g. Fixed Cash Reward"}
                  options={labelOf(REWARD_TYPES)}
                  onChange={(v) => set("rewardType", v)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Reward Amount"
                    type="number"
                    placeholder="10000"
                    value={form.rewardAmount}
                    onChange={(e) => set("rewardAmount", e.target.value)}
                  />
                  <FormInput
                    label="Maximum Campaign Budget"
                    type="number"
                    placeholder="1000000"
                    value={form.maxBudget}
                    onChange={(e) => set("maxBudget", e.target.value)}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="campaign-wizard-panel">
                <CustomSelect
                  label="Successful Referrals Required"
                  required
                  value={form.referralsRequired || "e.g. 4"}
                  options={COUNT_OPTIONS}
                  onChange={(v) => set("referralsRequired", v)}
                />

                <MultiCheckboxSelect
                  label="What must each referred user do?"
                  required
                  placeholder="e.g. Complete Sale"
                  value={actions}
                  options={labelOf(REFERRED_USER_ACTIONS)}
                  onChange={setActions}
                />

                <FormInput
                  label="Minimum qualifying transaction value"
                  required
                  type="number"
                  placeholder="50000"
                  value={form.minTransactionValue}
                  onChange={(e) => set("minTransactionValue", e.target.value)}
                />

                <label className="flex items-center gap-2 text-sm text-brand-gray-dark dark:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.useSeparateValues}
                    onChange={(e) => set("useSeparateValues", e.target.checked)}
                    className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                  />
                  Set different qualifying transaction values for each criteria
                </label>

                {form.useSeparateValues && (
                  <div className="flex flex-col gap-4">
                    {includesSale && (
                      <FormInput
                        label="Minimum qualifying transaction value for completed sale"
                        required
                        type="number"
                        placeholder="50000"
                        value={form.minValueCompletedSale}
                        onChange={(e) =>
                          set("minValueCompletedSale", e.target.value)
                        }
                      />
                    )}
                    {includesTransaction && (
                      <FormInput
                        label="Minimum qualifying transaction value for completed transaction"
                        required
                        type="number"
                        placeholder="50000"
                        value={form.minValueCompletedTransaction}
                        onChange={(e) =>
                          set("minValueCompletedTransaction", e.target.value)
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* "Referrer Requirements" step — no corresponding API field yet.
            {step === 3 && (
              <div className="campaign-wizard-panel">
                <CustomSelect
                  label="Referrer Transactions Required"
                  required
                  value={form.referrerTransactionsRequired || "e.g. 4"}
                  options={COUNT_OPTIONS}
                  onChange={(v) => set("referrerTransactionsRequired", v)}
                />
                <CustomSelect
                  label="Transaction Type"
                  required
                  value={form.transactionType || "e.g. Completed Sale"}
                  options={TRANSACTION_TYPES}
                  onChange={(v) => set("transactionType", v)}
                />
              </div>
            )}
            */}

            {step === 3 && (
              <div className="campaign-wizard-panel">
                <div>
                  <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
                    Qualification Window{" "}
                    <span className="text-brand-blue">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="e.g. 30"
                      value={form.qualificationWindow}
                      onChange={(e) =>
                        set("qualificationWindow", e.target.value)
                      }
                      className="w-full px-3 py-2.5 pr-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-brand-gray-dark dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-brand-gray-light">
                      Days
                    </span>
                  </div>
                </div>
                {/* "Countdown Starts From" — the API only takes the raw day count above.
                <CustomSelect
                  label="Countdown Starts From..."
                  required
                  value={form.countdownStartsFrom || "e.g. Campaign start"}
                  options={COUNTDOWN_OPTIONS}
                  onChange={(v) => set("countdownStartsFrom", v)}
                />
                */}
              </div>
            )}

            {step === 4 && (
              <div className="campaign-wizard-panel">
                <CustomSelect
                  label="Eligible Users"
                  required
                  value={form.eligibleUsers || "e.g. All Registered Users"}
                  options={labelOf(ELIGIBLE_USERS)}
                  onChange={(v) => set("eligibleUsers", v)}
                />
                <CustomSelect
                  label="Geographic Restriction"
                  required
                  value={
                    form.geographicRestriction || "e.g. All Supported Locations"
                  }
                  options={labelOf(GEO_OPTIONS)}
                  onChange={(v) => set("geographicRestriction", v)}
                />
              </div>
            )}

            {step === 5 && (
              <div className="campaign-wizard-panel">
                {VALIDATION_RULES.map(({ label: rule }) => (
                  <label
                    key={rule}
                    className="flex items-center gap-2 text-sm text-brand-gray-dark dark:text-gray-200 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.validationRules.includes(rule)}
                      onChange={() => toggleValidationRule(rule)}
                      className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                    />
                    {rule}
                  </label>
                ))}
              </div>
            )}

            {step === 6 && (
              <div className="campaign-wizard-panel">
                <CustomSelect
                  label="Payout Method"
                  required
                  value={form.payoutMethod || "e.g. Bank Transfer"}
                  options={labelOf(PAYMENT_METHODS)}
                  onChange={(v) => set("payoutMethod", v)}
                />
                <CustomSelect
                  label="Payment Schedule"
                  required
                  value={form.paymentSchedule || "e.g. Weekly Batch"}
                  options={labelOf(PAYMENT_SCHEDULES)}
                  onChange={(v) => set("paymentSchedule", v)}
                />
              </div>
            )}

            {step === 7 && (
              <div className="flex flex-col gap-4">
                <ReviewSection title="Basic Information">
                  <ReviewRow
                    label="Campaign Name"
                    value={form.name || "—"}
                    highlight
                  />
                  <ReviewRow
                    label="Description"
                    value={form.description || "—"}
                  />
                  <ReviewRow
                    label="Internal Campaign Code"
                    value={form.code || "—"}
                  />
                  <ReviewRow
                    label="Start Date"
                    value={formatDate(form.startDate)}
                  />
                  <ReviewRow
                    label="End Date"
                    value={formatDate(form.endDate)}
                  />
                </ReviewSection>

                <ReviewSection title="Reward">
                  <ReviewRow
                    label="Reward Type"
                    value={form.rewardType || "—"}
                  />
                  <ReviewRow
                    label="Reward Amount"
                    value={money(form.rewardAmount)}
                  />
                  <ReviewRow
                    label="Max. Campaign Budget"
                    value={money(form.maxBudget)}
                  />
                </ReviewSection>

                <ReviewSection title="Referral Requirements">
                  <ReviewRow
                    label="Successful Referrals Required"
                    value={form.referralsRequired || "—"}
                  />
                  <ReviewRow
                    label="What must each referred user do?"
                    value={actions.join(", ") || "—"}
                  />
                  <ReviewRow
                    label="Minimum Qualifying Transaction Value"
                    value={money(form.minTransactionValue)}
                  />
                </ReviewSection>

                {/* "Referrer Requirements" — no corresponding API field yet.
                <ReviewSection title="Referrer Requirements">
                  <ReviewRow
                    label="Referrer Transaction Required"
                    value={form.referrerTransactionsRequired || "—"}
                  />
                  <ReviewRow
                    label="Transaction Type"
                    value={form.transactionType || "—"}
                  />
                </ReviewSection>
                */}

                <ReviewSection title="Time Rules">
                  <ReviewRow
                    label="Qualification Window"
                    value={
                      form.qualificationWindow
                        ? `${form.qualificationWindow} Days`
                        : "—"
                    }
                  />
                  {/* "Countdown Starts From" — the API only takes the raw day count above.
                  <ReviewRow
                    label="Countdown Starts From..."
                    value={form.countdownStartsFrom || "—"}
                  />
                  */}
                </ReviewSection>

                <ReviewSection title="Eligibility">
                  <ReviewRow
                    label="Eligible Users"
                    value={form.eligibleUsers || "—"}
                  />
                  <ReviewRow
                    label="Geographic Restrictions"
                    value={form.geographicRestriction || "—"}
                  />
                </ReviewSection>

                <ReviewSection title="Validation Rules">
                  <ReviewRow
                    label="Rules"
                    value={form.validationRules.join(", ") || "—"}
                  />
                </ReviewSection>

                <ReviewSection title="Payout Rules">
                  <ReviewRow
                    label="Payout Method"
                    value={form.payoutMethod || "—"}
                  />
                  <ReviewRow
                    label="Payment Schedule"
                    value={form.paymentSchedule || "—"}
                  />
                </ReviewSection>
              </div>
            )}
          </div>
        </div>
      </BaseModal>

      {scheduleOpen && (
        <ScheduleCampaignModal
          isSubmitting={isSubmitting}
          onClose={() => setScheduleOpen(false)}
          onConfirm={handleSchedule}
        />
      )}
    </>
  );
}

function ReviewSection({
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

function ReviewRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="campaign-review-row">
      <span className="campaign-review-label">{label}</span>
      <span
        className={`campaign-review-value ${highlight ? "text-brand-blue" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
