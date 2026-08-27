import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isSubmitting,
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  const isDanger = variant === "danger";

  return (
    <BaseModal
      title={title}
      titleColor={isDanger ? "text-[#F04438]" : undefined}
      onClose={onClose}
      width="max-w-md"
      footer={
        <>
          <Button
            onClick={onClose}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            {cancelLabel}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            bgColor={
              isDanger
                ? "bg-[#F04438] hover:bg-[#D92D20]"
                : "bg-brand-blue hover:bg-[#3F5EE0]"
            }
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting ? "Working..." : confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-brand-gray-dark dark:text-gray-300">
        {message}
      </p>
    </BaseModal>
  );
}