import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import FormInput from "@/components/generic/FormInput";
import CustomSelect from "@/components/generic/CustomSelect";
import Button from "@/components/generic/Button";

interface AddCategoryModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; status: string }) => void;
}

const statusOptions = ["Active", "Hidden"];

export default function AddCategoryModal({ onClose, onSubmit }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");

  const handleSubmit = () => {
    onSubmit({ name, status });
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
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            Add Category
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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <CustomSelect label="Status" value={status} options={statusOptions} onChange={setStatus} />
        </div>
      </div>
    </BaseModal>
  );
}