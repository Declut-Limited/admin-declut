import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import CustomSelect from "@/components/generic/CustomSelect";
import Button from "@/components/generic/Button";
import FormTextarea from "@/components/generic/FormTextArea";
import type { SuspendUserPayload } from "../types";

interface SuspendUserModalProps {
  userName: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: SuspendUserPayload) => void;
}

const reasonOptions = [
  "Policy violation",
  "Fraudulent activity",
  "Multiple user reports",
  "Non-payment / chargeback abuse",
  "Other (see notes)",
];

const durationOptions = ["7 days", "14 days", "30 days", "90 days", "Indefinite"];

const durationDaysMap: Record<string, number | null> = {
  "7 days": 7,
  "14 days": 14,
  "30 days": 30,
  "90 days": 90,
  Indefinite: null,
};

const outcomeOptions = [
  "Automatically reactivate after suspension period",
  "Require manual review before reactivation",
  "Delete account after suspension period",
  "Permanent ban — do not reactivate",
];

const outcomeValueMap: Record<string, string> = {
  "Automatically reactivate after suspension period": "temporary_suspension",
  "Require manual review before reactivation": "manual_review",
  "Delete account after suspension period": "scheduled_deletion",
  "Permanent ban — do not reactivate": "permanent_ban",
};

export default function SuspendUserModal({
  userName,
  isSubmitting,
  onClose,
  onConfirm,
}: SuspendUserModalProps) {
  const [reason, setReason] = useState(reasonOptions[0]);
  const [duration, setDuration] = useState(durationOptions[2]);
  const [outcome, setOutcome] = useState(outcomeOptions[0]);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    onConfirm({
      reason,
      durationDays: durationDaysMap[duration],
      outcome: outcomeValueMap[outcome],
      notes: notes.trim() || undefined,
    });
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
            disabled={isSubmitting}
            bgColor="bg-[#2563EB] hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting ? "Suspending..." : "Suspend User"}
          </Button>
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-xs font-semibold text-brand-gray-light dark:text-gray-400 uppercase tracking-wide mb-3">
          Suspension Information
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <CustomSelect label="Reason" required value={reason} options={reasonOptions} onChange={setReason} />
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