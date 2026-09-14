import { useState } from "react";
import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import { getInitials } from "@/lib/utils/getInitials";
import { mockAssignableUsers, typeLabels } from "../mockData";
import type { FeedbackRow } from "../types";

interface AssignFeedbackModalProps {
  feedback: FeedbackRow;
  onClose: () => void;
  onAssign: (userName: string | null) => void;
  isSubmitting?: boolean;
}

export default function AssignFeedbackModal({
  feedback,
  onClose,
  onAssign,
  isSubmitting,
}: AssignFeedbackModalProps) {
  const [selected, setSelected] = useState<string | null>(feedback.assignedTo);

  return (
    <BaseModal
      title="Assign Feedback"
      subtitle={`${feedback.id} · ${typeLabels[feedback.type]}`}
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
            Cancel
          </Button>
          {feedback.assignedTo ? (
            <Button
              onClick={() => onAssign(null)}
              disabled={isSubmitting}
              bgColor="bg-[#FFFBFA] dark:bg-gray-900"
              textColor="text-[#F04438]"
              borderColor="border-[#F04438] dark:border-red-900"
            >
              Unassign
            </Button>
          ) : null}
          <Button
            onClick={() => selected && onAssign(selected)}
            disabled={isSubmitting || !selected || selected === feedback.assignedTo}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            {isSubmitting ? "Saving..." : "Assign"}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-1">
        {mockAssignableUsers.map((user) => {
          const isSelected = selected === user.name;
          const isCurrent = feedback.assignedTo === user.name;

          return (
            <button
              key={user.id}
              type="button"
              onClick={() => setSelected(user.name)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left cursor-pointer border ${
                isSelected
                  ? "bg-blue-50 dark:bg-blue-950/40 border-brand-blue"
                  : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
              >
                {getInitials(user.name)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-brand-gray-light truncate">{user.role}</p>
              </div>
              {isCurrent && (
                <span className="text-xs font-medium text-brand-blue shrink-0">Current</span>
              )}
            </button>
          );
        })}
      </div>
    </BaseModal>
  );
}
