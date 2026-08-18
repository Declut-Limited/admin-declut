import Button from "@/components/generic/Button";
import CustomSelect from "@/components/generic/CustomSelect";
import FormInput from "@/components/generic/FormInput";
import { useState } from "react";
import type { GeneralSettings } from "../types";
import { BsCheckCircleFill } from "react-icons/bs";

export function GeneralTab() {
  const [formData, setFormData] = useState<GeneralSettings>({
    company_name: "",
    support_email: "",
    default_currency: "NGN",
    timezone: "WAT",
  });

  const onChange = (field: keyof GeneralSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">General</h3>

      <div className="settings-field">
        <FormInput
          label="Company Name"
          value={formData.company_name}
          onChange={(e) => onChange("company_name", e.target.value)}
        />
      </div>

      <div className="settings-field">
        <FormInput
          label="Support Email"
          type="email"
          placeholder="name@mail.com"
          value={formData.support_email}
          onChange={(e) => onChange("support_email", e.target.value)}
        />
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <CustomSelect
            label="Default Currency"
            value={formData.default_currency}
            options={["NGN - Nigerian Naira"]}
            onChange={(val) => onChange("default_currency", val)}
          />
        </div>
        <div className="settings-field">
          <CustomSelect
            label="Timezone"
            value={formData.timezone}
            options={["WAT (UTC+1) - Lagos"]}
            onChange={(val) => onChange("timezone", val)}
          />
        </div>
      </div>
      <div className="w-2/3">
        <Button
          onClick={() => {}}
          bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
          textColor="text-white"
          borderColor="border-transparent"
        >
          <BsCheckCircleFill className="mr-1.5" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
