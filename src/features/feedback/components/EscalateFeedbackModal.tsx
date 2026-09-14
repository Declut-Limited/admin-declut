import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import CustomSelect from "@/components/generic/CustomSelect";
import FormTextarea from "@/components/generic/FormTextArea";
import type { FeedbackRow } from "../types";

interface EscalateFeedbackModalProps {
  feedback: FeedbackRow;
  onClose: () => void;
  onEscalate: (payload: { escalateTo: string; reason: string; notes: string }) => void;
  isSubmitting?: boolean;
}

const escalateToOptions = ["Operations", "Product", "Engineering", "Finance", "Trust & Safety"];
const reasonOptions = [
  "Operational Issue",
  "Payment Issue",
  "Security Concern",
  "Product Defect",
  "Needs Product Decision",
];

export default function EscalateFeedbackModal({
  feedback,
  onClose,
  onEscalate,
  isSubmitting,
}: EscalateFeedbackModalProps) {
  const [escalateTo, setEscalateTo] = useState(escalateToOptions[0]);
  const [reason, setReason] = useState(reasonOptions[0]);
  const [notes, setNotes] = useState("");

  return (
    <BaseModal
      title="Escalate Feedback"
      titleColor="text-[#F04438]"
      subtitle={feedback.id}
      onClose={onClose}
      width="max-w-2xl"
      height="max-h-[90vh]"
      footer={
        <>
          <Button
            onClick={onClose}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onEscalate({ escalateTo, reason, notes })}
            disabled={isSubmitting}
            bgColor="bg-[#F04438] hover:bg-[#D92D20]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting ? "Escalating..." : "Escalate"}
          </Button>
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-4">
          Escalation Information
        </p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <CustomSelect
            label="Escalate To"
            required
            value={escalateTo}
            options={escalateToOptions}
            onChange={setEscalateTo}
          />
          <CustomSelect
            label="Reason"
            required
            value={reason}
            options={reasonOptions}
            onChange={setReason}
          />
        </div>

        <FormTextarea
          label="Internal Notes"
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add context for the receiving team"
        />
      </div>
    </BaseModal>
  );
}
