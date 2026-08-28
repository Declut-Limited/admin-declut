import Button from "@/components/generic/Button";
import CustomSelect from "@/components/generic/CustomSelect";
import FormInput from "@/components/generic/FormInput";
import { useState } from "react";
import type { GeneralSettings, Settings } from "../types";
import { BsCheckCircleFill } from "react-icons/bs";
import { useSettings, useUpdateGeneralSettings } from "../queries";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import Skeleton from "@/components/generic/Skeleton";

const CURRENCY_OPTIONS = [{ label: "NGN - Nigerian Naira", value: "NGN" }];
const TIMEZONE_OPTIONS = [
  { label: "WAT (UTC+1) - Lagos", value: "Africa/Lagos" },
];

const labelFor = (
  options: { label: string; value: string }[],
  value: string,
) => options.find((o) => o.value === value)?.label ?? options[0].label;

const valueFor = (
  options: { label: string; value: string }[],
  label: string,
) => options.find((o) => o.label === label)?.value ?? options[0].value;

export function GeneralTab() {
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

  return <GeneralForm settings={settings} />;
}

function GeneralForm({ settings }: { settings: Settings }) {
  const { mutateAsync: updateGeneral, isPending } = useUpdateGeneralSettings();

  const [formData, setFormData] = useState<GeneralSettings>({
    companyName: settings.companyName ?? "",
    supportEmail: settings.supportEmail ?? "",
    defaultCurrency: settings.defaultCurrency ?? "NGN",
    timezone: settings.timezone ?? "Africa/Lagos",
  });

  const onChange = (field: keyof GeneralSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    showToast.promise(updateGeneral(formData), {
      loading: "Saving changes...",
      success: "General settings updated.",
      error: "Couldn't save settings.",
    });
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">General</h3>

      <div className="settings-field">
        <FormInput
          label="Company Name"
          value={formData.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
        />
      </div>

      <div className="settings-field">
        <FormInput
          label="Support Email"
          type="email"
          placeholder="name@mail.com"
          value={formData.supportEmail}
          onChange={(e) => onChange("supportEmail", e.target.value)}
        />
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <CustomSelect
            label="Default Currency"
            value={labelFor(CURRENCY_OPTIONS, formData.defaultCurrency)}
            options={CURRENCY_OPTIONS.map((o) => o.label)}
            onChange={(val) =>
              onChange("defaultCurrency", valueFor(CURRENCY_OPTIONS, val))
            }
          />
        </div>
        <div className="settings-field">
          <CustomSelect
            label="Timezone"
            value={labelFor(TIMEZONE_OPTIONS, formData.timezone)}
            options={TIMEZONE_OPTIONS.map((o) => o.label)}
            onChange={(val) =>
              onChange("timezone", valueFor(TIMEZONE_OPTIONS, val))
            }
          />
        </div>
      </div>

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