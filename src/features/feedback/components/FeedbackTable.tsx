import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/generic/DataTable";
import ConfirmModal from "@/components/generic/ConfirmModal";
import { createFeedbackColumns } from "./columns";
import EscalateFeedbackModal from "./EscalateFeedbackModal";
import { showToast } from "@/lib/utils/toast";
import { useUpdateFeedbackStatus } from "../queries";
import type { FeedbackListItem } from "../types";

interface FeedbackTableProps {
  rows: FeedbackListItem[];
  emptyMessage?: string;
  compact?: boolean;
  query?: { isLoading: boolean; isError: boolean; error: unknown };
}

export default function FeedbackTable({
  rows,
  emptyMessage = "No feedback found.",
  compact = false,
  query,
}: FeedbackTableProps) {
  const navigate = useNavigate();
  const [resolvingRow, setResolvingRow] = useState<FeedbackListItem | null>(null);
  const [escalatingRow, setEscalatingRow] = useState<FeedbackListItem | null>(null);
  const { mutateAsync: updateStatus, isPending: isSubmitting } =
    useUpdateFeedbackStatus();

  const columns = useMemo(
    () =>
      createFeedbackColumns({
        onViewDetails: (row) => navigate(`/feedback/${row.slug}`),
        onMarkInReview: (row) => {
          showToast.promise(
            updateStatus({ feedbackId: row.id, payload: { status: "in_review" } }),
            {
              loading: "Marking as In Review...",
              success: `${row.slug} is now in review.`,
              error: "Couldn't update feedback status.",
            },
          );
        },
        onMarkResolved: (row) => setResolvingRow(row),
        onEscalate: (row) => setEscalatingRow(row),
      }, compact),
    [navigate, compact, updateStatus],
  );

  return (
    <>
      <DataTable data={rows} columns={columns} query={query} emptyMessage={emptyMessage} />

      {resolvingRow && (
        <ConfirmModal
          title="Mark feedback as resolved?"
          message="This feedback will move out of the active review queue. It stays in the audit history."
          confirmLabel="Mark as Resolved"
          variant="default"
          isSubmitting={isSubmitting}
          onClose={() => setResolvingRow(null)}
          onConfirm={() => {
            showToast.promise(
              updateStatus({
                feedbackId: resolvingRow.id,
                payload: { status: "resolved" },
              }).then(() => setResolvingRow(null)),
              {
                loading: "Marking as resolved...",
                success: `${resolvingRow.slug} has been marked as resolved.`,
                error: "Couldn't resolve feedback.",
              },
            );
          }}
        />
      )}

      {escalatingRow && (
        <EscalateFeedbackModal
          feedback={escalatingRow}
          isSubmitting={isSubmitting}
          onClose={() => setEscalatingRow(null)}
          onEscalate={({ escalateTo, reason, notes }) => {
            showToast.promise(
              updateStatus({
                feedbackId: escalatingRow.id,
                payload: {
                  status: "escalated",
                  escalatedTo: escalateTo,
                  escalatedReason: reason,
                  escalatedInternalNote: notes,
                },
              }).then(() => setEscalatingRow(null)),
              {
                loading: "Escalating feedback...",
                success: `${escalatingRow.slug} has been escalated.`,
                error: "Couldn't escalate feedback.",
              },
            );
          }}
        />
      )}
    </>
  );
}
