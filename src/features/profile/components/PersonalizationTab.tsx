/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/generic/Button";
import CustomSelect from "@/components/generic/CustomSelect";
import Skeleton from "@/components/generic/Skeleton";
import { useState } from "react";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTheme } from "@/lib/theme/useTheme";
import { useMe, useUpdateDashboardPreferences } from "@/features/auth/queries";
import type { AdminProfile } from "@/features/auth/types";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import type { DashboardPreferences } from "../types";

const TIMEZONE_OPTIONS = [
  { label: "West Africa Time (UTC+1)", value: "Africa/Lagos" },
];

const DEFAULT_PREFERENCES: DashboardPreferences = {
  landingPage: "Dashboard",
  rowsPerPage: 10,
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12-Hour",
  timezone: "Africa/Lagos",
  language: "English",
};

const LANDING_PAGE_OPTIONS = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Users", value: "users" },
  { label: "Listings", value: "listings" },
  { label: "Categories", value: "categories" },
  { label: "Reviews", value: "reviews" },
  { label: "Transactions", value: "transactions" },
  { label: "Reports", value: "reports" },
  { label: "Activity", value: "activity" },
  { label: "Content", value: "content" },
  { label: "Notifications", value: "notifications" },
  { label: "Promotion", value: "promotion" },
  { label: "Referrals", value: "referrals" },
  { label: "Waitlist", value: "waitlist" },
  { label: "Settings", value: "settings" },
  { label: "Roles", value: "roles" },
];

const landingLabel = (value: string) =>
  LANDING_PAGE_OPTIONS.find((o) => o.value === value.toLowerCase())?.label ??
  LANDING_PAGE_OPTIONS[0].label;

const landingValue = (label: string) =>
  LANDING_PAGE_OPTIONS.find((o) => o.label === label)?.value ??
  LANDING_PAGE_OPTIONS[0].value;

const timezoneLabel = (value: string) =>
  TIMEZONE_OPTIONS.find((o) => o.value === value)?.label ??
  TIMEZONE_OPTIONS[0].label;

const timezoneValue = (label: string) =>
  TIMEZONE_OPTIONS.find((o) => o.label === label)?.value ??
  TIMEZONE_OPTIONS[0].value;

export function PersonalizationTab() {
  const { data: me, isLoading, isError, error } = useMe();

  if (isLoading) {
    return (
      <div className="settings-panel">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (isError || !me) {
    return (
      <div className="settings-panel">
        <p className="text-sm text-brand-gray-dark dark:text-gray-300">
          {getApiErrorMessage(error, "Couldn't load your preferences.")}
        </p>
      </div>
    );
  }

  return <PersonalizationForm me={me} />;
}

function PersonalizationForm({ me }: { me: AdminProfile }) {
  const { theme, setTheme } = useTheme();
  const { mutateAsync: updatePreferences, isPending } =
    useUpdateDashboardPreferences();

  const [formData, setFormData] = useState<DashboardPreferences>(
    me.dashboardPreferences ?? DEFAULT_PREFERENCES,
  );

  const onChange = <K extends keyof DashboardPreferences>(
    field: K,
    value: DashboardPreferences[K],
  ) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    showToast.promise(updatePreferences(formData), {
      loading: "Saving preferences...",
      success: "Preferences updated.",
      error: "Couldn't save preferences.",
    });
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Personalization</h3>

      <div className="settings-subsection">
        <p className="settings-subsection-title">Appearance</p>
        <p className="settings-subsection-hint">
          Choose how Declut Admin looks on this device.
        </p>

        <div className="appearance-options-grid">
          {(["light", "dark", "system"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTheme(mode)}
              className={`appearance-option ${theme === mode ? "appearance-option-active" : ""}`}
            >
              <span className="appearance-option-label capitalize">{mode}</span>
              {mode === "system" ? (
                <div className="appearance-option-preview-split">
                  <span className="appearance-option-preview-dark">Aa</span>
                  <span className="appearance-option-preview-light">Aa</span>
                </div>
              ) : (
                <span
                  className={`appearance-option-preview ${mode === "dark" ? "appearance-option-preview-dark" : "appearance-option-preview-light"}`}
                >
                  Aa
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <h3 className="settings-panel-title">Dashboard Preferences</h3>

      <div className="settings-field-row">
        <div className="settings-field">
          <CustomSelect
            label="Landing Page"
            value={landingLabel(formData.landingPage)}
            options={LANDING_PAGE_OPTIONS.map((o) => o.label)}
            onChange={(val) => onChange("landingPage", landingValue(val))}
          />
        </div>
        <div className="settings-field">
          <CustomSelect
            label="Default Rows per Page"
            value={String(formData.rowsPerPage)}
            options={["10", "20", "25", "50", "100"]}
            onChange={(val) => onChange("rowsPerPage", Number(val))}
          />
        </div>
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <CustomSelect
            label="Date Format"
            value={formData.dateFormat}
            options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
            onChange={(val) => onChange("dateFormat", val)}
          />
        </div>
        <div className="settings-field">
          <CustomSelect
            label="Time Format"
            value={formData.timeFormat}
            options={["12-Hour", "24-Hour"]}
            onChange={(val) => onChange("timeFormat", val)}
          />
        </div>
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <CustomSelect
            label="Timezone"
            value={timezoneLabel(formData.timezone)}
            options={TIMEZONE_OPTIONS.map((o) => o.label)}
            onChange={(val) => onChange("timezone", timezoneValue(val))}
          />
        </div>
        <div className="settings-field">
          <CustomSelect
            label="Language"
            value={formData.language}
            options={["English"]}
            onChange={(val) => onChange("language", val)}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => setFormData(DEFAULT_PREFERENCES)}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-brand-gray-dark dark:text-gray-200"
          borderColor="border-gray-200 dark:border-gray-700"
        >
          Reset to Default
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending}
          bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
          textColor="text-white"
          borderColor="border-transparent"
        >
          <BsCheckCircleFill className="mr-1.5" />
          {isPending ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
