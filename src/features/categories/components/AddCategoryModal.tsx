import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import FormInput from "@/components/generic/FormInput";
import CustomSelect from "@/components/generic/CustomSelect";
import Button from "@/components/generic/Button";

interface AddCategoryModalProps {
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string }) => void;
}

export default function AddCategoryModal({
  isSubmitting,
  onClose,
  onSubmit,
}: AddCategoryModalProps) {
  const [title, setTitle] = useState("");

  const canSubmit = title.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ title: title.trim() });
  };

  return (
    <BaseModal
      title="Add Category"
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
            {isSubmitting ? "Adding..." : "Add Category"}
          </Button>
        </>
      }
    >
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
          Category Information
        </p>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Category Name"
            required
            placeholder="e.g. Baby Products"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* New categories are always created active — toggle from the table afterwards */}
          <div className="pointer-events-none opacity-60">
            <CustomSelect
              label="Status"
              value="Active"
              options={["Active"]}
              onChange={() => {}}
            />
          </div>
        </div>
      </div>
    </BaseModal>
  );
}