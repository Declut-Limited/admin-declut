import Button from "@/components/generic/Button";
import CustomSelect from "@/components/generic/CustomSelect";
import { useState } from "react";
import type { ProfilePersonalization } from "../types";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTheme } from "@/lib/theme/useTheme";

export function PersonalizationTab() {
  const { theme, setTheme } = useTheme();

  const [formData, setFormData] = useState<ProfilePersonalization>({
    appearance: "Light",
    landing_page: "Dashboard",
    default_rows_per_page: "10",
    date_format: "DD/MM/YYYY",
    time_format: "12-Hour",
    timezone: "West Africa Time (UTC+1)",
    language: "English",
  });

  const onChange = <K extends keyof ProfilePersonalization>(
    field: K,
    value: ProfilePersonalization[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
            value={formData.landing_page}
            options={["Dashboard", "Users", "Listings", "Transactions"]}
            onChange={(val) => onChange("landing_page", val)}
          />
        </div>
        <div className="settings-field">
          <CustomSelect
            label="Default Rows per Page"
            value={formData.default_rows_per_page}
            options={["10", "25", "50", "100"]}
            onChange={(val) => onChange("default_rows_per_page", val)}
          />
        </div>
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <CustomSelect
            label="Date Format"
            value={formData.date_format}
            options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
            onChange={(val) => onChange("date_format", val)}
          />
        </div>
        <div className="settings-field">
          <CustomSelect
            label="Time Format"
            value={formData.time_format}
            options={["12-Hour", "24-Hour"]}
            onChange={(val) => onChange("time_format", val)}
          />
        </div>
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <CustomSelect
            label="Timezone"
            value={formData.timezone}
            options={["West Africa Time (UTC+1)"]}
            onChange={(val) => onChange("timezone", val)}
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
          onClick={() => {}}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-brand-gray-dark dark:text-gray-200"
          borderColor="border-gray-200 dark:border-gray-700"
        >
          Reset to Default
        </Button>
        <Button
          onClick={() => {}}
          bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
          textColor="text-white"
          borderColor="border-transparent"
        >
          <BsCheckCircleFill className="mr-1.5" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
