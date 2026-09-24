import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit3, FiFile, FiTrash2 } from "react-icons/fi";
import { MdOutlineRateReview } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import { BsCheckCircleFill } from "react-icons/bs";
import { LuNotepadText } from "react-icons/lu";
import Button from "@/components/generic/Button";
import NotFoundState from "@/components/generic/NotFoundState";
import PageLoader from "@/components/generic/PageLoader";
import ConfirmModal from "@/components/generic/ConfirmModal";
import StarRating from "@/components/generic/StarRating";
import { getInitials } from "@/lib/utils/getInitials";
import { showToast } from "@/lib/utils/toast";
import { useMe } from "@/features/auth/queries";
import EscalateFeedbackModal from "./EscalateFeedbackModal";
import {
  statusLabels,
  statusPillClass,
  typeLabels,
  typePillClass,
} from "../mockData";
import {
  useAddFeedbackNote,
  useDeleteFeedbackNote,
  useFeedback,
  useUpdateFeedbackNote,
  useUpdateFeedbackStatus,
} from "../queries";
import type { FeedbackNoteRecord } from "../types";


const ratingLabel: Record<number, string> = {
  5: "Excellent",
  4: "Good",
  3: "Average",
  2: "Poor",
  1: "Very Poor",
};

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return `${date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · ${date.toLocaleTimeString(
    "en-US",
    { hour: "numeric", minute: "2-digit" },
  )}`;
}

export default function FeedbackDetailPage() {
  const { feedbackId } = useParams<{ feedbackId: string }>();
  const navigate = useNavigate();

  const { data: me } = useMe();
  const { data: detail, isLoading, isError } = useFeedback(feedbackId);
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateFeedbackStatus();
  const { mutate: addNote, isPending: isAddingNote } =
    useAddFeedbackNote(detail?.id);
  const { mutate: updateNote, isPending: isUpdatingNote } =
    useUpdateFeedbackNote();
  const { mutateAsync: deleteNoteAsync } = useDeleteFeedbackNote();

  const [escalating, setEscalating] = useState(false);
  const [resolving, setResolving] = useState(false);

  if (isLoading) return <PageLoader />;

  if (isError || !detail) {
    return (
      <NotFoundState
        icon={<FiFile className="w-5 h-5" />}
        message="Feedback not found."
      />
    );
  }

  const handleMarkInReview = () => {
    showToast.promise(
      updateStatus({ feedbackId: detail.id, payload: { status: "in_review" } }),
      {
        loading: "Marking as In Review...",
        success: "Marked as In Review",
        error: "Couldn't update feedback status.",
      },
    );
  };

  const handleAddNote = (description: string) => {
    addNote(description, {
      onSuccess: () => showToast.success("Note added"),
      onError: () => showToast.error("Couldn't add note"),
    });
  };

  const handleUpdateNote = (noteId: string, description: string) => {
    updateNote(
      { noteId, description },
      {
        onSuccess: () => showToast.success("Note updated"),
        onError: () => showToast.error("Couldn't update note"),
      },
    );
  };

  const handleDeleteNote = (noteId: string) => {
    showToast.promise(deleteNoteAsync(noteId), {
      loading: "Deleting note...",
      success: "Note deleted.",
      error: "Couldn't delete note.",
    });
  };

  return (
    <div>
      <button
        onClick={() => navigate("/feedback?tab=All+Feedback")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to All Feedback
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-[#FAFAFA] dark:bg-gray-900/50 rounded-xl p-4 mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-[#1D2939] dark:text-gray-100 tracking-wide">
              {detail.slug}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[detail.status]}`}
            >
              {statusLabels[detail.status]}
              {detail.status === "escalated" && detail.escalatedTo
                ? ` · ${detail.escalatedTo}`
                : ""}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typePillClass[detail.type]}`}
            >
              {typeLabels[detail.type]}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1.5 text-xs text-brand-gray-light">
            <span>Submitted {formatDateTime(detail.createdAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <StarRating rating={detail.rating} size="w-3.5 h-3.5" />
              {detail.rating}/5 · {ratingLabel[detail.rating]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {detail.status !== "in_review" && (
            <Button
              leftIcon={
                <MdOutlineRateReview className="w-4 h-4 text-[#98A2B3]" />
              }
              onClick={handleMarkInReview}
              disabled={isUpdatingStatus}
            >
              Mark as In Review
            </Button>
          )}
          {detail.status !== "escalated" && (
            <Button
              leftIcon={<TbAlertTriangle className="w-4 h-4" />}
              bgColor="bg-[#FFFBFA] dark:bg-gray-900"
              textColor="text-[#F04438]"
              borderColor="border-[#F04438] dark:border-red-900"
              onClick={() => setEscalating(true)}
            >
              Escalate
            </Button>
          )}
          {detail.status !== "resolved" && (
            <Button
              leftIcon={<BsCheckCircleFill className="w-4 h-4" />}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              onClick={() => setResolving(true)}
            >
              Mark as Resolved
            </Button>
          )}
        </div>
      </div>

      {/* body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Feedback Message
            </p>
            <p className="text-sm text-brand-gray-dark dark:text-gray-300">
              {detail.feedbackDescription}
            </p>
          </div>

          {detail.status === "escalated" && detail.escalatedReason && (
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Escalation
              </p>
              <div className="profile-info-row">
                <span className="profile-info-label">Escalated To</span>
                <span className="profile-info-value">{detail.escalatedTo}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Reason</span>
                <span className="profile-info-value">
                  {detail.escalatedReason}
                </span>
              </div>
              {detail.escalatedInternalNote && (
                <div className="profile-info-row">
                  <span className="profile-info-label">Internal Note</span>
                  <span className="profile-info-value">
                    {detail.escalatedInternalNote}
                  </span>
                </div>
              )}
            </div>
          )}

          <NotesSection
            notes={detail.internalNotes}
            currentAdminId={me?.id}
            onAddNote={handleAddNote}
            isAdding={isAddingNote}
            onUpdateNote={handleUpdateNote}
            isUpdating={isUpdatingNote}
            onDeleteNote={handleDeleteNote}
          />

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Activity
            </p>
            <div className="relative">
              {detail.activityLogs.length === 0 ? (
                <p className="text-sm text-brand-gray-light">
                  No activity recorded yet.
                </p>
              ) : (
                detail.activityLogs.map((event, i) => (
                  <div
                    key={event.id}
                    className="relative flex gap-3 pb-6 last:pb-0"
                  >
                    {i < detail.activityLogs.length - 1 && (
                      <span className="absolute left-1.25 top-4 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                    )}
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 z-10"
                      style={{
                        backgroundColor: i === 0 ? "#2563EB" : "#344054",
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                        {event.label}
                      </p>
                      <p className="text-xs text-brand-gray-light mt-0.5">
                        {formatDateTime(event.createdAt)} · {event.actor.name}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              User Information
            </p>
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, #D19E00, #2563EB)",
                }}
              >
                {getInitials(detail.user.name)}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                  {detail.user.name}
                </p>
                <p className="text-xs text-brand-gray-light">
                  {detail.user.email}
                </p>
              </div>
            </div>

            {detail.user.phone && (
              <div className="profile-info-row">
                <span className="profile-info-label">Phone</span>
                <span className="profile-info-value">{detail.user.phone}</span>
              </div>
            )}
            <div className="profile-info-row">
              <span className="profile-info-label">Contact Permission</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  detail.canContactMe
                    ? "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950"
                    : "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                }`}
              >
                {detail.canContactMe ? "Allowed" : "Not Allowed"}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Total Listings</span>
              <span className="profile-info-value">
                {detail.user.listingCount}
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button
                onClick={() => {
                  window.location.href = `mailto:${detail.user.email}`;
                }}
                className="w-full justify-center"
                bgColor="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40"
                textColor="text-brand-blue"
                borderColor="border-transparent"
              >
                Contact User
              </Button>
              <Button
                onClick={() => navigate(`/users/${detail.user.id}`)}
                className="w-full justify-center"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {escalating && (
        <EscalateFeedbackModal
          feedback={detail}
          isSubmitting={isUpdatingStatus}
          onClose={() => setEscalating(false)}
          onEscalate={({ escalateTo, reason, notes }) => {
            showToast.promise(
              updateStatus({
                feedbackId: detail.id,
                payload: {
                  status: "escalated",
                  escalatedTo: escalateTo,
                  escalatedReason: reason,
                  escalatedInternalNote: notes,
                },
              }).then(() => setEscalating(false)),
              {
                loading: "Escalating feedback...",
                success: `${detail.slug} has been escalated to ${escalateTo}.`,
                error: "Couldn't escalate feedback.",
              },
            );
          }}
        />
      )}

      {resolving && (
        <ConfirmModal
          title="Mark feedback as resolved?"
          message="This feedback will move out of the active review queue. It stays in the audit history."
          confirmLabel="Mark as Resolved"
          variant="default"
          isSubmitting={isUpdatingStatus}
          onClose={() => setResolving(false)}
          onConfirm={() => {
            showToast.promise(
              updateStatus({
                feedbackId: detail.id,
                payload: { status: "resolved" },
              }).then(() => setResolving(false)),
              {
                loading: "Marking as resolved...",
                success: `${detail.slug} has been marked as resolved.`,
                error: "Couldn't resolve feedback.",
              },
            );
          }}
        />
      )}
    </div>
  );
}

function NotesSection({
  notes,
  currentAdminId,
  onAddNote,
  isAdding,
  onUpdateNote,
  isUpdating,
  onDeleteNote,
}: {
  notes: FeedbackNoteRecord[];
  currentAdminId: string | undefined;
  onAddNote: (description: string) => void;
  isAdding: boolean;
  onUpdateNote: (noteId: string, description: string) => void;
  isUpdating: boolean;
  onDeleteNote: (noteId: string) => void;
}) {
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const handleSubmit = () => {
    const trimmed = newNote.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setNewNote("");
  };

  const startEditing = (note: FeedbackNoteRecord) => {
    setEditingNoteId(note.id);
    setEditValue(note.description);
  };

  const handleSaveEdit = (noteId: string) => {
    const trimmed = editValue.trim();
    if (!trimmed) return;
    onUpdateNote(noteId, trimmed);
    setEditingNoteId(null);
  };

  return (
    <div className="detail-section-card border-none">
      <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
        Internal Notes
      </p>

      <div className="flex flex-col gap-2 mb-3">
        {notes.length === 0 && (
          <p className="text-sm text-brand-gray-light">No notes yet.</p>
        )}
        {notes.map((note) => {
          const isOwnNote =
            !!currentAdminId && note.writtenBy?.id === currentAdminId;
          const isEditing = editingNoteId === note.id;

          return (
            <div
              key={note.id}
              className="bg-[#EFF6FF] dark:bg-blue-950 rounded-lg p-3 group relative"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                  {note.writtenBy?.name ?? "Admin"}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-gray-light">
                    {formatDateTime(note.createdAt)}
                  </span>
                  {isOwnNote && !isEditing && (
                    <>
                      <button
                        onClick={() => startEditing(note)}
                        className="text-brand-gray-light hover:text-brand-blue"
                      >
                        <FiEdit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setDeletingNoteId(note.id)}
                        className="text-brand-gray-light hover:text-red-500"
                      >
                        <FiTrash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {isEditing ? (
                <div className="mt-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:border-brand-blue resize-none"
                  />
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button
                      onClick={() => setEditingNoteId(null)}
                      className="text-xs text-brand-gray-dark dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={isUpdating || !editValue.trim()}
                      onClick={() => handleSaveEdit(note.id)}
                      className="text-xs bg-brand-blue text-white px-3 py-1.5 rounded-lg hover:bg-[#3F5EE0] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-1">
                  {note.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a private note..."
          rows={3}
          className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 text-sm placeholder:text-gray-400 focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <span className="text-xs text-brand-gray-light">
            Visible to admins only
          </span>
          <button
            disabled={isAdding || !newNote.trim()}
            onClick={handleSubmit}
            className="flex items-center gap-1.5 bg-brand-blue text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#3F5EE0] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LuNotepadText className="w-3 h-3" />{" "}
            {isAdding ? "Adding..." : "Add Note"}
          </button>
        </div>
      </div>

      {deletingNoteId && (
        <ConfirmModal
          title="Delete note"
          message="Are you sure you want to delete this note? This can't be undone."
          confirmLabel="Delete"
          variant="danger"
          onClose={() => setDeletingNoteId(null)}
          onConfirm={() => {
            onDeleteNote(deletingNoteId);
            setDeletingNoteId(null);
          }}
        />
      )}
    </div>
  );
}
