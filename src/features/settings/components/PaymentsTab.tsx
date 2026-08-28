import Button from "@/components/generic/Button";
// import CustomSelect from "@/components/generic/CustomSelect";
import ToggleSwitch from "@/components/generic/ToggleSwitch";
import Skeleton from "@/components/generic/Skeleton";
import { useState } from "react";
import type { PaymentsSettings, Settings } from "../types";
import { BsCheckCircleFill } from "react-icons/bs";
import { useSettings, useUpdatePaymentsSettings } from "../queries";
import { showToast } from "@/lib/utils/toast";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";

export default function PaymentsTab() {
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

  return <PaymentsForm settings={settings} />;
}

function PaymentsForm({ settings }: { settings: Settings }) {
  const { mutateAsync: updatePayments, isPending } =
    useUpdatePaymentsSettings();

  const [formData, setFormData] = useState<PaymentsSettings>({
    cardPaymentsEnabled: settings.cardPaymentsEnabled ?? false,
    bankTransferEnabled: settings.bankTransferEnabled ?? false,
    inspectionWindow: settings.inspectionWindow ?? {
      inspectionPeriod: 3,
      allowExtension: false,
      maxExtensionPeriod: 2,
    },
    maxCodeAttempts: settings.maxCodeAttempts ?? 3,
  });

  const toggle = (field: "cardPaymentsEnabled" | "bankTransferEnabled") => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const setInspection = <K extends keyof PaymentsSettings["inspectionWindow"]>(
    field: K,
    value: PaymentsSettings["inspectionWindow"][K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      inspectionWindow: { ...prev.inspectionWindow, [field]: value },
    }));
  };

  const handleSave = () => {
    showToast.promise(updatePayments(formData), {
      loading: "Saving changes...",
      success: "Payment settings updated.",
      error: "Couldn't save settings.",
    });
  };

  return (
    <div className="settings-panel">
      <h3 className="settings-panel-title">Payments</h3>

      <div className="settings-toggle-row">
        <div>
          <p className="settings-toggle-label">Card payments</p>
          <p className="settings-toggle-description">
            Accept Visa, Mastercard, Verve
          </p>
        </div>
        <ToggleSwitch
          checked={formData.cardPaymentsEnabled}
          onChange={() => toggle("cardPaymentsEnabled")}
        />
      </div>

      <div className="settings-toggle-row border-none">
        <div>
          <p className="settings-toggle-label">Bank transfer</p>
          <p className="settings-toggle-description">
            Accept direct bank transfers
          </p>
        </div>
        <ToggleSwitch
          checked={formData.bankTransferEnabled}
          onChange={() => toggle("bankTransferEnabled")}
        />
      </div>

      {/* TODO: no walletBalanceEnabled field on the payments endpoint
      <div className="settings-toggle-row border-none">
        <div>
          <p className="settings-toggle-label">Wallet balance</p>
          <p className="settings-toggle-description">
            Allow paying from in-app wallet
          </p>
        </div>
        <ToggleSwitch
          checked={formData.wallet_balance}
          onChange={() => toggle("wallet_balance")}
        />
      </div> */}

      <div className="settings-field">
        <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
          Max. Verification Attempts
        </label>
        <div className="settings-suffix-input">
          <input
            type="number"
            value={formData.maxCodeAttempts}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                maxCodeAttempts: Number(e.target.value) || 0,
              }))
            }
            className="settings-suffix-input-field"
          />
          <span className="settings-suffix-input-addon">Attempts</span>
        </div>
        {/* <p className="settings-field-hint">
          Then you should define what happens when the limit is reached. A good
          flow for Declut would be:
        </p> */}
      </div>

      <h3 className="settings-panel-title">Inspection Window</h3>

      <div className="settings-field">
        <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
          Inspection Period
        </label>
        <div className="settings-suffix-input">
          <input
            type="number"
            value={formData.inspectionWindow.inspectionPeriod}
            onChange={(e) =>
              setInspection("inspectionPeriod", Number(e.target.value) || 0)
            }
            className="settings-suffix-input-field"
          />
          <span className="settings-suffix-input-addon">Days</span>
        </div>
        <p className="settings-field-hint">
          The number of days a buyer has to inspect the item before the
          inspection window expires.
        </p>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.inspectionWindow.allowExtension}
          onChange={(e) => setInspection("allowExtension", e.target.checked)}
          className="settings-checkbox mt-2"
        />
        <span>
          <span className="settings-toggle-label">
            Allow Inspection Extension
          </span>
          <span className="settings-toggle-description block">
            Allow buyers to request additional time if they cannot complete the
            inspection within the original period.
          </span>
        </span>
      </label>

      <div className="settings-field">
        <label className="block text-xs text-[#1D2939] dark:text-gray-300 mb-1.5 font-medium">
          Maximum Extension Period
        </label>
        <div className="settings-suffix-input">
          <input
            type="number"
            value={formData.inspectionWindow.maxExtensionPeriod}
            onChange={(e) =>
              setInspection("maxExtensionPeriod", Number(e.target.value) || 0)
            }
            disabled={!formData.inspectionWindow.allowExtension}
            className="settings-suffix-input-field disabled:opacity-50"
          />
          <span className="settings-suffix-input-addon">Days</span>
        </div>
        <p className="settings-field-hint">
          Set the maximum additional time a buyer can receive after the original
          inspection period expires.
        </p>
      </div>

      {/* TODO: no escrowReleaseWindow field on the payments endpoint
      <div className="settings-field">
        <CustomSelect
          label="Escrow release window"
          value={formData.escrow_release_window}
          options={[
            "3 days after delivery",
            "5 days after delivery",
            "7 days after delivery",
          ]}
          onChange={(val) =>
            setFormData((prev) => ({ ...prev, escrow_release_window: val }))
          }
        />
      </div> */}

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
