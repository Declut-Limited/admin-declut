import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import FormInput from "@/components/generic/FormInput";
import CustomSelect from "@/components/generic/CustomSelect";
import RichTextEditor from "@/components/generic/RichTextEditor";
import Button from "@/components/generic/Button";
import type {
  CreateContentPayload,
  ContentType,
  ContentStatus,
  ContentRow,
} from "../types";

interface NewContentModalProps {
  content?: ContentRow;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateContentPayload) => void;
}

const CONTENT_TYPES: { label: string; value: ContentType }[] = [
  { label: "FAQ", value: "faq" },
  { label: "Page", value: "page" },
  { label: "Banner", value: "banner" },
];

const STATUSES: { label: string; value: ContentStatus }[] = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
];

const placementOptions = [
  "Home Page - Top Banner",
  "Home Page - Bottom Banner",
  "Help Center",
  "Checkout — Confirmation",
  "Seller Dashboard",
  "Category Page",
  "Footer",
  "Standalone Page (custom URL)",
];

export default function NewContentModal({
  content,
  isSubmitting,
  onClose,
  onSubmit,
}: NewContentModalProps) {
  const isEdit = Boolean(content);

  const [title, setTitle] = useState(content?.title ?? "");
  const [contentType, setContentType] = useState<ContentType>(
    content?.contentType ?? "faq",
  );
  const [placement, setPlacement] = useState(
    content?.whereToAppear ?? placementOptions[0],
  );
  const [status, setStatus] = useState<ContentStatus>(
    content?.status ?? "draft",
  );
  const [contentBody, setContentBody] = useState(content?.contentBody ?? "");

  const canSubmit = title.trim().length > 0 && contentBody.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      title: title.trim(),
      contentType,
      whereToAppear: placement,
      status,
      contentBody: contentBody,
    });
  };

  return (
    <BaseModal
      title={isEdit ? "Edit Content" : "New Content"}
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
            disabled={!canSubmit || isSubmitting}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Content"}
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
          value={
            CONTENT_TYPES.find((t) => t.value === contentType)?.label ?? "FAQ"
          }
          options={CONTENT_TYPES.map((t) => t.label)}
          onChange={(label) =>
            setContentType(
              CONTENT_TYPES.find((t) => t.label === label)?.value ?? "faq",
            )
          }
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomSelect
            label="Where This Appears"
            required
            value={placement}
            options={placementOptions}
            onChange={setPlacement}
          />
          <CustomSelect
            label="Status"
            value={STATUSES.find((s) => s.value === status)?.label ?? "Draft"}
            options={STATUSES.map((s) => s.label)}
            onChange={(label) =>
              setStatus(
                STATUSES.find((s) => s.label === label)?.value ?? "draft",
              )
            }
          />
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