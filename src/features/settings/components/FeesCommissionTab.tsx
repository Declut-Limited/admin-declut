import Button from "@/components/generic/Button";
// import CustomSelect from "@/components/generic/CustomSelect";
import FormInput from "@/components/generic/FormInput";
import Skeleton from "@/components/generic/Skeleton";
import { useState } from "react";
import type { FeesCommissionSettings, Settings } from "../types";
import { BsCheckCircleFill } from "react-icons/bs";
import { useSettings, useUpdateFeesCommissionSettings } from "../queries";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

export default function FeesCommissionTab() {
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

  return <FeesCommissionForm settings={settings} />;
}

function FeesCommissionForm({ settings }: { settings: Settings }) {
  const { mutateAsync: updateFees, isPending } =
    useUpdateFeesCommissionSettings();

  const [formData, setFormData] = useState({
    commissionPercentage: String(settings.commissionPercentage ?? ""),
    buyerServiceFeePercentage: String(settings.buyerServiceFeePercentage ?? ""),
    escrowReleaseFee: String(settings.escrowReleaseFee ?? ""),
    minimumPayoutThreshold: String(settings.minimumPayoutThreshold ?? ""),
  });

  const onChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const payload: FeesCommissionSettings = {
      commissionPercentage: Number(formData.commissionPercentage) || 0,
      buyerServiceFeePercentage: Number(formData.buyerServiceFeePercentage) || 0,
      escrowReleaseFee: Number(formData.escrowReleaseFee) || 0,
      minimumPayoutThreshold: Number(formData.minimumPayoutThreshold) || 0,
    };

    showToast.promise(updateFees(payload), {
      loading: "Saving changes...",
      success: "Fees & commission updated.",
      error: "Couldn't save settings.",
    });
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Fees & Commission</h3>

      <div className="settings-field-row">
        <div className="settings-field">
          <FormInput
            label="Default Commission Rate (%)"
            type="number"
            value={formData.commissionPercentage}
            onChange={(e) => onChange("commissionPercentage", e.target.value)}
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
            value={formData.buyerServiceFeePercentage}
            onChange={(e) =>
              onChange("buyerServiceFeePercentage", e.target.value)
            }
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
            value={formData.escrowReleaseFee}
            onChange={(e) => onChange("escrowReleaseFee", e.target.value)}
          />
        </div>
        <div className="settings-field">
          <FormInput
            label="Minimum Payout Threshold (₦)"
            type="number"
            value={formData.minimumPayoutThreshold}
            onChange={(e) => onChange("minimumPayoutThreshold", e.target.value)}
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