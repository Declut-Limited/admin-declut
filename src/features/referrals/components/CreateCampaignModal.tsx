import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import FormInput from "@/components/generic/FormInput";
import FormTextarea from "@/components/generic/FormTextArea";
import CustomSelect from "@/components/generic/CustomSelect";
import MultiCheckboxSelect from "@/components/generic/MultiCheckboxSelect";
import DatePicker from "@/components/generic/DatePicker";
import ScheduleCampaignModal from "./ScheduleCampaignModal";
import { BsCheckCircleFill } from "react-icons/bs";
import { showToast } from "@/lib/utils/toast";
import type { CampaignFormData } from "../types";

interface CreateCampaignModalProps {
  onClose: () => void;
}

const STEPS = [
  "Basic Information",
  "Reward",
  "Referral Requirements",
  "Referrer Requirements",
  "Time Rules",
  "Eligibility",
  "Validation Rules",
  "Payout Rules",
  "Review & Publish",
] as const;

const REWARD_TYPES = ["Fixed Cash Reward", "Wallet Credit (Future)"];
const REFERRED_USER_ACTIONS = ["Complete Purchase", "Complete Sale"];
const TRANSACTION_TYPES = [
  "Any Successful Transaction",
  "Purchases Only",
  "Sales Only",
];
const COUNTDOWN_OPTIONS = [
  "Campaign Start",
  "Referrer's First Referral",
  "First Referred Registration",
];
const ELIGIBLE_USERS = ["Verified Users Only", "All Registered Users"];
const GEO_OPTIONS = ["All Supported Locations", "Lagos Only", "Nigeria Only"];
const VALIDATION_RULES = [
  "Transaction Completed",
  "Escrow released",
  "Not refunded",
  "Not disputed",
  "Not flagged as fraud",
  "Meets minimum transaction amount",
];
const PAYOUT_METHODS = ["Bank Transfer", "Wallet Credit"];
const PAYMENT_SCHEDULES = [
  "Weekly Batch",
  "Manual Batch",
  "Immediately after approval",
];
const COUNT_OPTIONS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

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
  referrerTransactionsRequired: "",
  transactionType: "",
  qualificationWindow: "",
  countdownStartsFrom: "",
  eligibleUsers: "",
  geographicRestriction: "",
  validationRules: [...VALIDATION_RULES],
  payoutMethod: "",
  paymentSchedule: "",
};

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

export default function CreateCampaignModal({
  onClose,
}: CreateCampaignModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CampaignFormData>(initialForm);
  const [actions, setActions] = useState<string[]>([]);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const set = <K extends keyof CampaignFormData>(
    key: K,
    value: CampaignFormData[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const includesSale = actions.includes("Complete Sale");
  const includesPurchase = actions.includes("Complete Purchase");

  const toggleValidationRule = (rule: string) => {
    set(
      "validationRules",
      form.validationRules.includes(rule)
        ? form.validationRules.filter((r) => r !== rule)
        : [...form.validationRules, rule],
    );
  };

  const handlePublish = () => {
    // TODO: wire to referralsApi.createCampaign
    showToast.success("Campaign published", {
      description: `${form.name} is now live.`,
    });
    onClose();
  };

  const handleSaveDraft = () => {
    // TODO: wire to referralsApi.createCampaign with status draft
    showToast.success("Saved as draft", {
      description: `${form.name} has been saved.`,
    });
    onClose();
  };

  const handleSchedule = (schedule: { date: string; time: string }) => {
    // TODO: wire to referralsApi.scheduleCampaign
    showToast.success("Campaign scheduled", {
      description: `${form.name} will activate on ${formatDate(schedule.date)} at ${schedule.time}.`,
    });
    setScheduleOpen(false);
    onClose();
  };

  return (
    <>
      <BaseModal
        title="Create Campaign"
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
                bgColor="bg-white dark:bg-gray-900"
                textColor="text-brand-gray-dark dark:text-gray-200"
                borderColor="border-gray-200 dark:border-gray-700"
              >
                Save as Draft
              </Button>
              <Button
                onClick={() => setScheduleOpen(true)}
                bgColor="bg-white dark:bg-gray-900"
                textColor="text-brand-gray-dark dark:text-gray-200"
                borderColor="border-gray-200 dark:border-gray-700"
              >
                Schedule
              </Button>
              <Button
                onClick={handlePublish}
                bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
                textColor="text-white"
                borderColor="border-transparent"
              >
                Publish Campaign
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
                  <FormInput
                    label="Internal Campaign Code"
                    placeholder="HOLIDAY-26"
                    value={form.code}
                    onChange={(e) => set("code", e.target.value)}
                  />
                  <CustomSelect
                    label="Campaign Status"
                    value={form.status}
                    options={["Draft", "Scheduled", "Active"]}
                    onChange={(v) => set("status", v)}
                  />
                </div>
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
              </div>
            )}

            {step === 1 && (
              <div className="campaign-wizard-panel">
                <CustomSelect
                  label="Reward Type"
                  required
                  value={form.rewardType || "e.g. Fixed Cash Reward"}
                  options={REWARD_TYPES}
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
                  placeholder="e.g. Completed Sale"
                  value={actions}
                  options={REFERRED_USER_ACTIONS}
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
                  <div className="grid grid-cols-2 gap-4">
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
                    {includesPurchase && (
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

            {step === 4 && (
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

                <CustomSelect
                  label="Countdown Starts From..."
                  required
                  value={form.countdownStartsFrom || "e.g. Campaign start"}
                  options={COUNTDOWN_OPTIONS}
                  onChange={(v) => set("countdownStartsFrom", v)}
                />
              </div>
            )}

            {step === 5 && (
              <div className="campaign-wizard-panel">
                <CustomSelect
                  label="Eligible Users"
                  required
                  value={form.eligibleUsers || "e.g. Verified Users Only"}
                  options={ELIGIBLE_USERS}
                  onChange={(v) => set("eligibleUsers", v)}
                />
                <CustomSelect
                  label="Geographic Restriction"
                  required
                  value={
                    form.geographicRestriction || "e.g. All Supported Locations"
                  }
                  options={GEO_OPTIONS}
                  onChange={(v) => set("geographicRestriction", v)}
                />
              </div>
            )}

            {step === 6 && (
              <div className="campaign-wizard-panel">
                {VALIDATION_RULES.map((rule) => (
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

            {step === 7 && (
              <div className="campaign-wizard-panel">
                <CustomSelect
                  label="Payout Method"
                  required
                  value={form.payoutMethod || "e.g. Bank Transfer"}
                  options={PAYOUT_METHODS}
                  onChange={(v) => set("payoutMethod", v)}
                />
                <CustomSelect
                  label="Payment Schedule"
                  required
                  value={form.paymentSchedule || "e.g. Weekly Batch"}
                  options={PAYMENT_SCHEDULES}
                  onChange={(v) => set("paymentSchedule", v)}
                />
              </div>
            )}

            {step === 8 && (
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

                <ReviewSection title="Time Rules">
                  <ReviewRow
                    label="Qualification Window"
                    value={
                      form.qualificationWindow
                        ? `${form.qualificationWindow} Days`
                        : "—"
                    }
                  />
                  <ReviewRow
                    label="Countdown Starts From..."
                    value={form.countdownStartsFrom || "—"}
                  />
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
