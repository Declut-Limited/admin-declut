import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import FormInput from "@/components/generic/FormInput";
import Button from "@/components/generic/Button";
import type { UpdateListingPayload } from "../types";

interface EditListingModalProps {
  title: string;
  price: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (payload: UpdateListingPayload) => void;
}

export default function EditListingModal({
  title: initialTitle,
  price: initialPrice,
  isSubmitting,
  onClose,
  onConfirm,
}: EditListingModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [price, setPrice] = useState(String(initialPrice));

  const canSubmit = title.trim().length > 0 && price.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onConfirm({ title: title.trim(), price: Number(price) || 0 });
  };

  return (
    <BaseModal
      title="Edit Listing"
      onClose={onClose}
      width="max-w-xl"
      height="h-[350px]"
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
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
          Listing Information
        </p>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <FormInput
            label="Price (₦)"
            required
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>
    </BaseModal>
  );
}