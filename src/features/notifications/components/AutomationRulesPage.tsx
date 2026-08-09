import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import ToggleSwitch from "@/components/generic/ToggleSwitch";
import CustomSelect from "@/components/generic/CustomSelect";
import type { AutomationRule } from "../types";

const channelOptions = ["Push", "Email", "SMS"];
const delayOptions = [
  "Immediate",
  "15 minutes later",
  "1 hour later",
  "1 day later",
];

const initialRules: AutomationRule[] = [
  {
    id: "1",
    title: "Listing Approved",
    description:
      "Notify the seller when their listing is approved and goes live.",
    trigger: "Admin approves a Pending Review listing",
    channel: "Push",
    delay: "Immediate",
    enabled: true,
  },
  {
    id: "2",
    title: "Listing Flagged",
    description:
      "Notify the seller when their listing is flagged and pulled for review.",
    trigger: "Admin flags an Active listing",
    channel: "Email",
    delay: "Immediate",
    enabled: false,
  },
  {
    id: "3",
    title: "Verification Approved",
    description:
      "Notify the user when their identity/business verification is approved.",
    trigger: "Admin approves a verification submission",
    channel: "Email",
    delay: "Immediate",
    enabled: true,
  },
  {
    id: "4",
    title: "Verification Rejected",
    description:
      "Notify the user when their verification submission is rejected.",
    trigger: "Admin rejects a verification submission",
    channel: "Email",
    delay: "Immediate",
    enabled: false,
  },
  {
    id: "5",
    title: "Escrow Released",
    description:
      "Notify the seller when escrow funds from a sale are released to them.",
    trigger: "Admin releases held escrow",
    channel: "Push",
    delay: "Immediate",
    enabled: false,
  },
  {
    id: "6",
    title: "Payout Processed",
    description: "Notify the seller when a payout is marked as paid.",
    trigger: "Admin marks a payout Paid",
    channel: "Email",
    delay: "Immediate",
    enabled: false,
  },
  {
    id: "7",
    title: "Dispute Resolved",
    description: "Notify the buyer and seller once a dispute case is resolved.",
    trigger: "Admin resolves a dispute case",
    channel: "Email",
    delay: "Immediate",
    enabled: false,
  },
  {
    id: "8",
    title: "Account Suspended",
    description: "Notify a user when their account is suspended.",
    trigger: "Admin suspends a user account",
    channel: "Email",
    delay: "Immediate",
    enabled: false,
  },
  {
    id: "9",
    title: "Account Reactivated",
    description: "Notify a user when their suspended account is reactivated.",
    trigger: "Admin reactivates a user account",
    channel: "Push",
    delay: "1 hour later",
    enabled: false,
  },
];

export default function AutomationRulesPage() {
  const navigate = useNavigate();
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);

  const updateRule = (id: string, updates: Partial<AutomationRule>) => {
    setRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, ...updates } : rule)),
    );
    // TODO: wire to notificationsApi.updateAutomationRule
  };

  return (
    <div>
      <button
        onClick={() => navigate("/notifications")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Notifications
      </button>

      <PageHeaderBlock />

      <div className="detail-section-card border-none">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
          Event Triggers
        </p>

        <div className="flex flex-col">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between gap-4 py-4 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                  {rule.title}
                </p>
                <p className="text-xs text-brand-gray-light mt-0.5 mb-2">
                  {rule.description}
                </p>

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[#414651] bg-[#F6F6F6] rounded-xl p-2 dark:text-gray-300 dark:bg-gray-800">
                    Trigger:
                  </span>
                  <span className="inline-flex items-center text-brand-gray-dark dark:text-gray-300">
                    {rule.trigger}
                  </span>
                  <span className="text-brand-gray-light">·</span>
                  <span className="text-[#414651] bg-[#F6F6F6] rounded-xl p-2 dark:text-gray-300 dark:bg-gray-800">
                    Channel:
                  </span>
                  <div className="w-28">
                    <CustomSelect
                      value={rule.channel}
                      options={channelOptions}
                      onChange={(val) => updateRule(rule.id, { channel: val })}
                    />
                  </div>
                  <span className="text-brand-gray-light">·</span>
                  <span className="text-[#414651] bg-[#F6F6F6] rounded-xl p-2 dark:text-gray-300 dark:bg-gray-800">
                    Delay:
                  </span>
                  <div className="w-32">
                    <CustomSelect
                      value={rule.delay}
                      options={delayOptions}
                      onChange={(val) => updateRule(rule.id, { delay: val })}
                    />
                  </div>
                </div>
              </div>

              <ToggleSwitch
                checked={rule.enabled}
                onChange={(checked) =>
                  updateRule(rule.id, { enabled: checked })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageHeaderBlock() {
  return (
    <div className="mb-4">
      <h1 className="text-2xl tracking-wide font-bold text-brand-gray-dark dark:text-gray-100">
        Automation Rules
      </h1>
      <p className="text-sm text-brand-gray-light mt-1">
        Configure which real system events fire an automatic notification, on
        which channel, and with what delay.
      </p>
    </div>
  );
}
