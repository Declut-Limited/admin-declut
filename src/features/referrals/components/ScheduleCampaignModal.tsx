import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import DatePicker from "@/components/generic/DatePicker";
import TimePicker from "@/components/generic/TimePicker";

interface ScheduleCampaignModalProps {
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (schedule: { date: string; time: string }) => void;
}

export default function ScheduleCampaignModal({
  isSubmitting,
  onClose,
  onConfirm,
}: ScheduleCampaignModalProps) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const canSubmit = Boolean(date && time);

  return (
    <BaseModal
      title="Schedule Campaign"
      onClose={onClose}
      width="max-w-xl"
      height="h-[320px]"
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
            onClick={() => canSubmit && onConfirm({ date, time })}
            disabled={!canSubmit || isSubmitting}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting ? "Scheduling..." : "Confirm Schedule"}
          </Button>
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
          Schedule Info
        </p>

        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            label="Activation Date"
            required
            value={date}
            onChange={setDate}
          />
          <TimePicker
            label="Activation Time"
            required
            value={time}
            onChange={setTime}
          />
        </div>
      </div>
    </BaseModal>
  );
}