import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import FormInput from "@/components/generic/FormInput";
import FormTextarea from "@/components/generic/FormTextArea";
import type { EmailSellerPayload } from "../types";

interface EmailSellerModalProps {
  sellerName: string;
  listingTitle: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: EmailSellerPayload) => void;
}

export default function EmailSellerModal({
  sellerName,
  listingTitle,
  isSubmitting,
  onClose,
  onConfirm,
}: EmailSellerModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const canSubmit = subject.trim().length > 0 && message.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm({ subject: subject.trim(), message: message.trim() });
  };

  return (
    <BaseModal
      title={`Email ${sellerName}`}
      onClose={onClose}
      width="max-w-xl"
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
            disabled={!canSubmit || isSubmitting}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting ? "Sending..." : "Send Email"}
          </Button>
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col gap-4">
        <p className="text-xs text-brand-gray-light">
          Regarding{" "}
          <span className="font-medium text-brand-gray-dark dark:text-gray-200">
            {listingTitle}
          </span>
        </p>

        <FormInput
          label="Subject"
          required
          placeholder="About your listing photos"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <FormTextarea
          label="Message"
          required
          placeholder="Write your message to the seller"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </BaseModal>
  );
}