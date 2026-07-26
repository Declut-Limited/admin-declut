import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import CustomSelect from "@/components/generic/CustomSelect";
import Button from "@/components/generic/Button";
import FormTextarea from "@/components/generic/FormTextArea";

interface SuspendUserModalProps {
  userName: string;
  onClose: () => void;
  onConfirm: (data: {
    reason: string;
    duration: string;
    outcome: string;
    notes: string;
  }) => void;
}

const reasonOptions = [
  "Policy violation",
  "Fraudulent activity",
  "Multiple user reports",
  "Non-payment / chargeback abuse",
  "Other (see notes)",
];

const durationOptions = [
  "7 days",
  "14 days",
  "30 days",
  "90 days",
  "Indefinite",
];

const outcomeOptions = [
  "Automatically reactivate after suspension period",
  "Require manual review before reactivation",
  "Delete account after suspension period",
  "Permanent ban — do not reactivate",
];

export default function SuspendUserModal({
  userName,
  onClose,
  onConfirm,
}: SuspendUserModalProps) {
  const [reason, setReason] = useState(reasonOptions[0]);
  const [duration, setDuration] = useState(durationOptions[2]);
  const [outcome, setOutcome] = useState(outcomeOptions[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onConfirm({ reason, duration, outcome, notes });
  };

  return (
    <BaseModal
      title={`Suspend ${userName}`}
      titleColor="text-[#F04438]"
      onClose={onClose}
      width="max-w-2xl"
      footer={
        <>
          <Button
            onClick={onClose}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-gray-700 dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            bgColor="bg-[#2563EB] hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            Suspend User
          </Button>
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-xs font-semibold text-[#667085] dark:text-gray-400 uppercase tracking-wide mb-3">
          Suspension Information
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <CustomSelect
            label="Reason"
            required
            value={reason}
            options={reasonOptions}
            onChange={setReason}
          />
          <CustomSelect
            label="Suspension Duration"
            required
            value={duration}
            options={durationOptions}
            onChange={setDuration}
          />
        </div>

        <div className="mb-4">
          <CustomSelect
            label="Suspension Outcome"
            required
            value={outcome}
            options={outcomeOptions}
            onChange={setOutcome}
          />
        </div>

        <FormTextarea
          label="Internal Notes (optional)"
          placeholder="Context for suspension"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </BaseModal>
  );
}
