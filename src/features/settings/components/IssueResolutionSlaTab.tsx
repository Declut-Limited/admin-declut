import Button from "@/components/generic/Button";
import ToggleSwitch from "@/components/generic/ToggleSwitch";
import Skeleton from "@/components/generic/Skeleton";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import type { IssueResolutionSlaSettings, Settings } from "../types";
import { useSettings, useUpdateIssueResolutionSlaSettings } from "../queries";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

const chipClass = {
  start: "bg-[#EFF6FF] text-brand-blue dark:bg-blue-950 dark:text-blue-400",
  neutral: "bg-[#F2F4F7] text-brand-gray-dark dark:bg-gray-800 dark:text-gray-300",
  success: "text-[#12B76A] bg-[#ECFDF3] dark:text-green-400 dark:bg-green-950",
  danger: "text-[#F04438] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
};

export default function IssueResolutionSlaTab() {
  const { data: settings, isLoading, isError, error } = useSettings();

  if (isLoading) {
    return (
      <div className="settings-panel">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="settings-panel">
        <p className="text-sm text-brand-gray-dark dark:text-gray-300">
          {getApiErrorMessage(error, "Couldn't load settings.")}
        </p>
      </div>
    );
  }

  return <IssueResolutionSlaForm settings={settings} />;
}

type SlaFormState = Omit<
  IssueResolutionSlaSettings,
  "sellerResponseTimeHours" | "reminderTimeHours"
> & {
  sellerResponseTimeHours: string;
  reminderTimeHours: string;
};

function IssueResolutionSlaForm({ settings }: { settings: Settings }) {
  const { mutateAsync: updateSla, isPending } =
    useUpdateIssueResolutionSlaSettings();

  const [formData, setFormData] = useState<SlaFormState>({
    sellerResponseSlaEnabled: settings.sellerResponseSlaEnabled ?? false,
    sellerResponseTimeHours: String(settings.sellerResponseTimeHours ?? 24),
    autoEscalateOnExpiry: settings.autoEscalateOnExpiry ?? true,
    escalateTo: settings.escalateTo || "Admin Review",
    sendReminderBeforeDeadline: settings.sendReminderBeforeDeadline ?? true,
    reminderTimeHours: String(settings.reminderTimeHours ?? 6),
  });

  const toggle = (field: keyof SlaFormState) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const setField = <K extends keyof SlaFormState>(
    field: K,
    value: SlaFormState[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const payload: IssueResolutionSlaSettings = {
      ...formData,
      sellerResponseTimeHours: Number(formData.sellerResponseTimeHours) || 0,
      reminderTimeHours: Number(formData.reminderTimeHours) || 0,
    };

    showToast.promise(updateSla(payload), {
      loading: "Saving changes...",
      success: "Issue resolution SLA updated.",
      error: "Couldn't save settings.",
    });
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Issue Resolution SLA</h3>

      <div className="settings-toggle-row border-none">
        <div>
          <p className="settings-toggle-label">Enable Seller Response SLA</p>
          <p className="settings-toggle-description">
            Set how long sellers have to respond to reported issues before the
            case is automatically escalated for Admin review.
          </p>
        </div>
        <ToggleSwitch
          checked={formData.sellerResponseSlaEnabled}
          onChange={() => toggle("sellerResponseSlaEnabled")}
        />
      </div>

      {!formData.sellerResponseSlaEnabled && (
        <>
          <div className="settings-divider-dashed" />
          <div className="settings-notice-box">
            SLA is disabled. Reported issues stay open until a seller responds
            or an admin escalates them manually.
          </div>
        </>
      )}

      {formData.sellerResponseSlaEnabled && (
        <>
          <div className="settings-field">
            <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
              Seller Response Time
            </label>
            <div className="settings-suffix-input">
              <input
                type="number"
                value={formData.sellerResponseTimeHours}
                onChange={(e) =>
                  setField("sellerResponseTimeHours", e.target.value)
                }
                className="settings-suffix-input-field"
              />
              <span className="settings-suffix-input-addon">Hours</span>
            </div>
            <p className="settings-field-hint">
              Set how long a seller has to respond after an issue is raised.
            </p>
          </div>

          <div className="settings-toggle-row">
            <div>
              <p className="settings-toggle-label">
                Automatically Escalate on SLA Expiry
              </p>
              <p className="settings-toggle-description">
                Escalate the issue to Admin if the seller does not respond
                before the response deadline.
              </p>
            </div>
            <ToggleSwitch
              checked={formData.autoEscalateOnExpiry}
              onChange={() => toggle("autoEscalateOnExpiry")}
            />
          </div>

          {formData.autoEscalateOnExpiry && (
            <div className="settings-field">
              <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
                Escalate To
              </label>
              <div className="settings-static-field">{formData.escalateTo}</div>
              <p className="settings-field-hint">
                Escalated cases enter the Admin review queue under Trust &amp;
                Safety &gt; Disputes.
              </p>
            </div>
          )}

          <div className="settings-toggle-row">
            <div>
              <p className="settings-toggle-label">
                Send Reminder Before Deadline
              </p>
              <p className="settings-toggle-description">
                Notify the seller before their response window expires.
              </p>
            </div>
            <ToggleSwitch
              checked={formData.sendReminderBeforeDeadline}
              onChange={() => toggle("sendReminderBeforeDeadline")}
            />
          </div>

          {formData.sendReminderBeforeDeadline && (
            <div className="settings-field-row">
              <div className="settings-field">
                <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
                  Reminder Time
                </label>
                <input
                  type="number"
                  value={formData.reminderTimeHours}
                  onChange={(e) =>
                    setField("reminderTimeHours", e.target.value)
                  }
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-brand-gray-dark dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div className="settings-field">
                <label className="block text-xs text-transparent mb-1.5 font-medium select-none">
                  &nbsp;
                </label>
                <div className="settings-static-field">
                  Hours before deadline
                </div>
              </div>
            </div>
          )}

          <SlaSummary formData={formData} />
        </>
      )}

      <div className="w-2/3">
        <Button
          onClick={handleSave}
          disabled={isPending}
          bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
          textColor="text-white"
          borderColor="border-transparent"
        >
          <BsCheckCircleFill className="mr-1.5" />
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function SlaSummary({ formData }: { formData: SlaFormState }) {
  const reminderValue = formData.sendReminderBeforeDeadline
    ? `${formData.reminderTimeHours} hours before deadline`
    : "Disabled";

  const expiryValue = formData.autoEscalateOnExpiry
    ? "Automatically escalate to Admin"
    : "Stays open until resolved manually";

  return (
    <div className="sla-summary-box">
      <p className="settings-panel-title">SLA Summary</p>

      <div className="sla-summary-grid">
        <div>
          <p className="sla-summary-label">Seller Response Time</p>
          <p className="sla-summary-value">
            {formData.sellerResponseTimeHours} hours
          </p>
        </div>
        <div>
          <p className="sla-summary-label">Reminder</p>
          <p className="sla-summary-value">{reminderValue}</p>
        </div>
        <div>
          <p className="sla-summary-label">On Expiry</p>
          <p className="sla-summary-value">{expiryValue}</p>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700" />

      <div className="flex flex-wrap items-center gap-2">
        <span className={`sla-flow-chip ${chipClass.start}`}>
          Issue raised
        </span>
        <FiArrowRight className="w-3.5 h-3.5 text-brand-gray-light shrink-0" />
        <span className={`sla-flow-chip ${chipClass.neutral}`}>
          Seller notified
        </span>
        {formData.sendReminderBeforeDeadline && (
          <>
            <FiArrowRight className="w-3.5 h-3.5 text-brand-gray-light shrink-0" />
            <span className={`sla-flow-chip ${chipClass.neutral}`}>
              Reminder at {formData.reminderTimeHours}h remaining
            </span>
          </>
        )}
        <FiArrowRight className="w-3.5 h-3.5 text-brand-gray-light shrink-0" />
        <span className={`sla-flow-chip ${chipClass.success}`}>
          Responds → resolution continues
        </span>
        <span className="text-brand-gray-light">/</span>
        <span className={`sla-flow-chip ${chipClass.danger}`}>
          {formData.autoEscalateOnExpiry
            ? "No response → escalated to Admin"
            : "No response → stays open"}
        </span>
      </div>

      <p className="settings-field-hint">
        New rules apply to newly raised issues. Deadlines on active disputes
        are not changed.
      </p>
    </div>
  );
}
