import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUserCheck, FiFile, FiPlus } from "react-icons/fi";
import { MdOutlineRateReview } from "react-icons/md";
import { TbAlertTriangle } from "react-icons/tb";
import { BsCheckCircleFill } from "react-icons/bs";
import Button from "@/components/generic/Button";
import NotFoundState from "@/components/generic/NotFoundState";
import ConfirmModal from "@/components/generic/ConfirmModal";
import StarRating from "@/components/generic/StarRating";
import { useMe } from "@/features/auth/queries";
import { getInitials } from "@/lib/utils/getInitials";
import { showToast } from "@/lib/utils/toast";
import AssignFeedbackModal from "./AssignFeedbackModal";
import EscalateFeedbackModal from "./EscalateFeedbackModal";
import {
  buildFeedbackDetail,
  mockFeedbackRows,
  statusLabels,
  statusPillClass,
  typeLabels,
  typePillClass,
} from "../mockData";
import type { FeedbackDetail, FeedbackNote } from "../types";

const ratingLabel: Record<number, string> = {
  5: "Excellent",
  4: "Good",
  3: "Average",
  2: "Poor",
  1: "Very Poor",
};

const userStatusPillClass: Record<FeedbackDetail["user"]["status"], string> = {
  active: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  suspended: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  banned: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-950",
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

  const row = mockFeedbackRows.find((r) => r.id === feedbackId);
  const initialDetail = useMemo(() => (row ? buildFeedbackDetail(row) : null), [row]);

  const [detail, setDetail] = useState<FeedbackDetail | null>(initialDetail);
  const [noteDraft, setNoteDraft] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [resolving, setResolving] = useState(false);

  if (!detail) {
    return (
      <NotFoundState icon={<FiFile className="w-5 h-5" />} message="Feedback not found." />
    );
  }

  const handleAssignToMe = () => {
    const name = me?.name ?? "You";
    setDetail((prev) => (prev ? { ...prev, assignedTo: name } : prev));
    // TODO: wire assign endpoint
    showToast.success("Feedback assigned to you");
  };

  const handleMarkInReview = () => {
    setDetail((prev) => (prev ? { ...prev, status: "in_review" } : prev));
    // TODO: wire mark-in-review endpoint
    showToast.success("Marked as In Review");
  };

  const handleAddNote = () => {
    if (!noteDraft.trim()) return;
    const note: FeedbackNote = {
      id: String(Date.now()),
      author: me?.name ?? "Admin",
      timestamp: "Just now",
      body: noteDraft.trim(),
    };
    setDetail((prev) => (prev ? { ...prev, notes: [note, ...prev.notes] } : prev));
    // TODO: wire add-note endpoint
    showToast.success("Note added", { description: "Your note is visible to admins only." });
    setNoteDraft("");
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
              {detail.id}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[detail.status]}`}
            >
              {statusLabels[detail.status]}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typePillClass[detail.type]}`}
            >
              {typeLabels[detail.type]}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-1.5 text-xs text-brand-gray-light">
            <span>Submitted {formatDateTime(detail.submittedAt)}</span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <StarRating rating={detail.rating} size="w-3.5 h-3.5" />
              {detail.rating}/5 · {ratingLabel[detail.rating]}
            </span>
            <span>·</span>
            <span>
              Assigned to:{" "}
              <span className="text-brand-gray-dark dark:text-gray-300 font-medium">
                {detail.assignedTo ?? "Unassigned"}
              </span>{" "}
              <button
                onClick={() => setAssigning(true)}
                className="text-brand-blue hover:underline cursor-pointer"
              >
                Change
              </button>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            leftIcon={<FiUserCheck className="w-4 h-4 text-[#98A2B3]" />}
            onClick={handleAssignToMe}
          >
            Assign to me
          </Button>
          {detail.status !== "in_review" && (
            <Button
              leftIcon={<MdOutlineRateReview className="w-4 h-4 text-[#98A2B3]" />}
              onClick={handleMarkInReview}
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
            <p className="text-sm text-brand-gray-dark dark:text-gray-300">{detail.message}</p>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Attachments · {detail.attachments.length}
            </p>
            {detail.attachments.length === 0 ? (
              <p className="text-sm text-brand-gray-light">
                No attachments were submitted with this feedback.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {detail.attachments.map((file) => (
                  <div key={file.id} className="w-32">
                    <div className="w-32 h-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <FiFile className="w-6 h-6 text-brand-gray-light" />
                    </div>
                    <p
                      className="text-xs text-brand-gray-dark dark:text-gray-300 mt-1.5 truncate"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <a href={file.url} className="text-brand-blue hover:underline">
                        View
                      </a>
                      <span className="text-brand-gray-light">·</span>
                      <a href={file.url} download className="text-brand-blue hover:underline">
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-section-card border-none">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
                Internal Notes
              </p>
            </div>

            {detail.notes.length > 0 && (
              <div className="flex flex-col gap-3 mb-4">
                {detail.notes.map((note) => (
                  <div key={note.id} className="internal-note">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                        {note.author}
                      </p>
                      <span className="text-xs text-brand-gray-light shrink-0">
                        {note.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-1">
                      {note.body}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="note-composer">
              <textarea
                rows={3}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add a note for your team..."
                className="note-composer-input"
              />
              <div className="note-composer-footer">
                <span className="text-xs text-brand-gray-light">Visible to admins only</span>
                <Button
                  onClick={handleAddNote}
                  disabled={!noteDraft.trim()}
                  bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
                  textColor="text-white"
                  borderColor="border-transparent"
                >
                  <FiPlus className="w-4 h-4" /> Add Note
                </Button>
              </div>
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Activity
            </p>
            <div className="relative">
              {detail.activity.map((event, i) => (
                <div key={event.id} className="relative flex gap-3 pb-6 last:pb-0">
                  {i < detail.activity.length - 1 && (
                    <span className="absolute left-1.25 top-4 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                  )}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 mt-1 z-10"
                    style={{ backgroundColor: i === 0 ? "#2563EB" : "#344054" }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                      {event.label}
                    </p>
                    <p className="text-xs text-brand-gray-light mt-0.5">
                      {event.timestamp} · {event.actor}
                    </p>
                  </div>
                </div>
              ))}
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
                style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
              >
                {getInitials(detail.user.name)}
              </span>
              <div>
                <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                  {detail.user.name}
                </p>
                <p className="text-xs text-brand-gray-light">{detail.user.email}</p>
              </div>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Role</span>
              <span className="profile-info-value">{detail.user.role}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Status</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${userStatusPillClass[detail.user.status]}`}
              >
                {detail.user.status.charAt(0).toUpperCase() + detail.user.status.slice(1)}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Contact Permission</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  detail.user.contactPermission
                    ? "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950"
                    : "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800"
                }`}
              >
                {detail.user.contactPermission ? "Allowed" : "Not Allowed"}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Total Listings</span>
              <span className="profile-info-value">{detail.user.totalListings}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">
                {new Date(detail.user.memberSince).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Rating</span>
              <StarRating rating={detail.user.rating} size="w-3.5 h-3.5" />
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button
                onClick={() => {
                  // TODO: wire contact-user flow
                  showToast.info("Contact options coming soon", {
                    description: `Reach out to ${detail.user.name} directly via ${detail.user.email}.`,
                  });
                }}
                className="w-full justify-center"
                bgColor="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40"
                textColor="text-brand-blue"
                borderColor="border-transparent"
              >
                Contact User
              </Button>
              <Button
                onClick={() => {
                  // TODO: link to the real user profile once user ids are available
                }}
                className="w-full justify-center"
              >
                View Profile
              </Button>
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Assignment
            </p>
            {detail.assignedTo ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                    style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
                  >
                    {getInitials(detail.assignedTo)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                      {detail.assignedTo}
                    </p>
                    <p className="text-xs text-brand-gray-light">Admin</p>
                  </div>
                </div>
                <Button onClick={() => setAssigning(true)}>Assign</Button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-brand-gray-light">Unassigned</p>
                <Button onClick={() => setAssigning(true)}>Assign</Button>
              </div>
            )}
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Submission Context
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">App Version</span>
              <span className="profile-info-value">{detail.submissionContext.appVersion}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Device</span>
              <span className="profile-info-value">{detail.submissionContext.device}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Operating System</span>
              <span className="profile-info-value">{detail.submissionContext.os}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Screen</span>
              <span className="profile-info-value">{detail.submissionContext.screen}</span>
            </div>
          </div>
        </div>
      </div>

      {assigning && (
        <AssignFeedbackModal
          feedback={detail}
          onClose={() => setAssigning(false)}
          onAssign={(userName) => {
            setDetail((prev) => (prev ? { ...prev, assignedTo: userName } : prev));
            // TODO: wire assign endpoint
            showToast.success(userName ? "Feedback assigned" : "Feedback unassigned", {
              description: userName
                ? `${detail.id} assigned to ${userName}.`
                : `${detail.id} is now unassigned.`,
            });
            setAssigning(false);
          }}
        />
      )}

      {escalating && (
        <EscalateFeedbackModal
          feedback={detail}
          onClose={() => setEscalating(false)}
          onEscalate={({ escalateTo }) => {
            setDetail((prev) =>
              prev ? { ...prev, status: "escalated", escalatedTo: escalateTo } : prev,
            );
            // TODO: wire escalate endpoint
            showToast.success("Feedback escalated", {
              description: `${detail.id} has been escalated to ${escalateTo}.`,
            });
            setEscalating(false);
          }}
        />
      )}

      {resolving && (
        <ConfirmModal
          title="Mark feedback as resolved?"
          message="This feedback will move out of the active review queue. It stays in the audit history."
          confirmLabel="Mark as Resolved"
          variant="default"
          onClose={() => setResolving(false)}
          onConfirm={() => {
            setDetail((prev) => (prev ? { ...prev, status: "resolved" } : prev));
            // TODO: wire mark-resolved endpoint
            showToast.success("Feedback resolved", {
              description: `${detail.id} has been marked as resolved.`,
            });
            setResolving(false);
          }}
        />
      )}
    </div>
  );
}
