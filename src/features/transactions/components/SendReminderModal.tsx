import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import { FiBell } from "react-icons/fi";

interface SendReminderModalProps {
  buyerName: string;
  lastNotified: string;
  onClose: () => void;
  onSend: (data: { type: string; channel: string }) => void;
}

const reminderTypes = ["Inspection Reminder", "Deadline Warning", "Custom Message"];
const channels = ["PUSH", "EMAIL"];

export default function SendReminderModal({ buyerName, lastNotified, onClose, onSend }: SendReminderModalProps) {
  const [type, setType] = useState(reminderTypes[0]);
  const [channel, setChannel] = useState(channels[0]);

  return (
    <BaseModal
      title="Send Reminder to Buyer"
      onClose={onClose}
      width="max-w-sm"
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
            onClick={() => onSend({ type, channel })}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
            leftIcon={<FiBell className="w-4 h-4" />}
          >
            Send Reminder
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-2 bg-[#FFFBEB] dark:bg-amber-950 rounded-lg px-3 py-2 mb-4">
        <FiBell className="w-4 h-4 text-[#DC6803] dark:text-amber-400 shrink-0" />
        <div>
          <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">{buyerName}</p>
          <p className="text-xs text-[#DC6803] dark:text-amber-400">Last notified: {lastNotified}</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">Reminder Type</p>
      <div className="flex flex-col gap-2 mb-4">
        {reminderTypes.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`text-left px-3 py-2.5 rounded-lg border text-sm flex items-center gap-2 ${
              type === option
                ? "border-brand-blue bg-blue-50 dark:bg-blue-950 text-brand-blue font-medium"
                : "border-gray-200 dark:border-gray-700 text-brand-gray-dark dark:text-gray-200"
            }`}
          >
            <span
              className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                type === option ? "border-brand-blue bg-brand-blue" : "border-gray-300"
              }`}
            />
            {option}
          </button>
        ))}
      </div>

      <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">Channel</p>
      <div className="grid grid-cols-2 gap-2">
        {channels.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setChannel(option)}
            className={`py-2 rounded-lg border text-sm font-medium ${
              channel === option
                ? "border-brand-blue bg-[#DBEAFE] dark:bg-blue-950 text-brand-blue"
                : "border-gray-200 dark:border-gray-700 text-brand-gray-dark dark:text-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </BaseModal>
  );
}