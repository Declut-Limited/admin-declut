import Button from "@/components/generic/Button";
import CustomSelect from "@/components/generic/CustomSelect";
import FormInput from "@/components/generic/FormInput";
import { useState } from "react";
import type { FeesCommissionSettings } from "../types";
import { BsCheckCircleFill } from "react-icons/bs";

export default function FeesCommissionTab() {
  const [formData, setFormData] = useState<FeesCommissionSettings>({
    default_commission_rate: "",
    buyer_service_fee: "",
    escrow_release_fee: "",
    minimum_payout_threshold: "",
    default_currency: "NGN - Nigerian Naira",
    timezone: "WAT (UTC+1) - Lagos",
  });
  const onChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Fees & Commission</h3>

      <div className="settings-field-row">
        <div className="settings-field">
          <FormInput
            label="Default Commission Rate (%)"
            type="number"
            value={formData?.default_commission_rate}
            onChange={(e) =>
              onChange("default_commission_rate", e.target.value)
            }
          />
          <p className="settings-field-hint">
            Percentage the platform keeps from every successful sale before
            payout to the seller. Applied live across Transactions and Finance.
          </p>
        </div>
        <div className="settings-field">
          <FormInput
            label="Buyer Service Fee (%)"
            type="number"
            value={formData.buyer_service_fee}
            onChange={(e) => onChange("buyer_service_fee", e.target.value)}
          />
          <p className="settings-field-hint">
            Added on top of the item price at checkout.
          </p>
        </div>
      </div>

      <div className="settings-field-row">
        <div className="settings-field">
          <FormInput
            label="Escrow Release Fee (₦)"
            type="number"
            value={formData.escrow_release_fee}
            onChange={(e) => onChange("escrow_release_fee", e.target.value)}
          />
        </div>
        <div className="settings-field">
          <FormInput
            label="Minimum Payout Threshold (₦)"
            type="number"
            value={formData.minimum_payout_threshold}
            onChange={(e) =>
              onChange("minimum_payout_threshold", e.target.value)
            }
          />
        </div>
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
