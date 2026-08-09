import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import FormInput from "@/components/generic/FormInput";
import CustomSelect from "@/components/generic/CustomSelect";
import RichTextEditor from "@/components/generic/RichTextEditor";
import Button from "@/components/generic/Button";

interface NewContentModalProps {
  onClose: () => void;
  onSubmit: (data: Record<string, string>) => void;
}

const contentTypeOptions = ["FAQ", "Page", "Banner"];
const placementOptions = ["Home Page - Top Banner", "Help Center", "Checkout — Confirmation", "Seller Dashboard", "Category Page", "Standalone Page (custom URL)"];
const statusOptions = ["Draft", "Published"];

export default function NewContentModal({ onClose, onSubmit }: NewContentModalProps) {
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState(contentTypeOptions[0]);
  const [placement, setPlacement] = useState(placementOptions[0]);
  const [status, setStatus] = useState(statusOptions[0]);
  const [contentBody, setContentBody] = useState("");

  const handleSubmit = () => {
    onSubmit({ title, contentType, placement, status, contentBody });
  };

  return (
    <BaseModal
      title="New Content"
      onClose={onClose}
      width="max-w-2xl"
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
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            Create Content
          </Button>
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-col gap-4">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
          Content Details
        </p>

        <FormInput
          label="Title"
          required
          placeholder="e.g. Holiday Shipping faq"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <CustomSelect
          label="Content Type"
          required
          value={contentType}
          options={contentTypeOptions}
          onChange={setContentType}
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            label="Where This Appears"
            required
            value={placement}
            options={placementOptions}
            onChange={setPlacement}
          />
          <CustomSelect label="Status" value={status} options={statusOptions} onChange={setStatus} />
        </div>

        <RichTextEditor
          label="Content Body"
          required
          value={contentBody}
          onChange={setContentBody}
          placeholder="Write the content..."
        />
      </div>
    </BaseModal>
  );
}