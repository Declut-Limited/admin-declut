import Button from "@/components/generic/Button";
import CustomSelect from "@/components/generic/CustomSelect";
import ToggleSwitch from "@/components/generic/ToggleSwitch";
import { useState } from "react";
import type { PaymentsSettings } from "../types";
import { BsCheckCircleFill } from "react-icons/bs";

export default function PaymentsTab() {
  const [formData, setFormData] = useState<PaymentsSettings>({
    card_payments: false,
    bank_transfer: false,
    wallet_balance: false,
    escrow_release_window: "3 days after delivery",
  });

  const toggle = (field: keyof PaymentsSettings) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
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
          checked={formData.card_payments}
          onChange={() => toggle("card_payments")}
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
          checked={formData.bank_transfer}
          onChange={() => toggle("bank_transfer")}
        />
      </div>

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
      </div>

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
