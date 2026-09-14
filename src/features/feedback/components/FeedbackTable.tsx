import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/generic/DataTable";
import ConfirmModal from "@/components/generic/ConfirmModal";
import { createFeedbackColumns } from "./columns";
import AssignFeedbackModal from "./AssignFeedbackModal";
import EscalateFeedbackModal from "./EscalateFeedbackModal";
import { showToast } from "@/lib/utils/toast";
import type { FeedbackRow } from "../types";

interface FeedbackTableProps {
  rows: FeedbackRow[];
  emptyMessage?: string;
  compact?: boolean;
}

export default function FeedbackTable({
  rows,
  emptyMessage = "No feedback found.",
  compact = false,
}: FeedbackTableProps) {
  const navigate = useNavigate();
  const [resolvingRow, setResolvingRow] = useState<FeedbackRow | null>(null);
  const [assigningRow, setAssigningRow] = useState<FeedbackRow | null>(null);
  const [escalatingRow, setEscalatingRow] = useState<FeedbackRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = useMemo(
    () =>
      createFeedbackColumns({
        onViewDetails: (row) => navigate(`/feedback/${row.id}`),
        onMarkInReview: (row) => {
          // TODO: wire mark-in-review endpoint
          showToast.success("Marked as In Review", {
            description: `${row.id} is now in review.`,
          });
        },
        onMarkResolved: (row) => setResolvingRow(row),
        onAssign: (row) => setAssigningRow(row),
        onEscalate: (row) => setEscalatingRow(row),
      }, compact),
    [navigate, compact],
  );

  return (
    <>
      <DataTable data={rows} columns={columns} emptyMessage={emptyMessage} />

      {resolvingRow && (
        <ConfirmModal
          title="Mark feedback as resolved?"
          message="This feedback will move out of the active review queue. It stays in the audit history."
          confirmLabel="Mark as Resolved"
          variant="default"
          isSubmitting={isSubmitting}
          onClose={() => setResolvingRow(null)}
          onConfirm={() => {
            setIsSubmitting(true);
            // TODO: wire mark-resolved endpoint
            showToast.success("Feedback resolved", {
              description: `${resolvingRow.id} has been marked as resolved.`,
            });
            setIsSubmitting(false);
            setResolvingRow(null);
          }}
        />
      )}

      {assigningRow && (
        <AssignFeedbackModal
          feedback={assigningRow}
          isSubmitting={isSubmitting}
          onClose={() => setAssigningRow(null)}
          onAssign={(userName) => {
            setIsSubmitting(true);
            // TODO: wire assign endpoint
            showToast.success(userName ? "Feedback assigned" : "Feedback unassigned", {
              description: userName
                ? `${assigningRow.id} assigned to ${userName}.`
                : `${assigningRow.id} is now unassigned.`,
            });
            setIsSubmitting(false);
            setAssigningRow(null);
          }}
        />
      )}

      {escalatingRow && (
        <EscalateFeedbackModal
          feedback={escalatingRow}
          isSubmitting={isSubmitting}
          onClose={() => setEscalatingRow(null)}
          onEscalate={() => {
            setIsSubmitting(true);
            // TODO: wire escalate endpoint
            showToast.success("Feedback escalated", {
              description: `${escalatingRow.id} has been escalated.`,
            });
            setIsSubmitting(false);
            setEscalatingRow(null);
          }}
        />
      )}
    </>
  );
}
