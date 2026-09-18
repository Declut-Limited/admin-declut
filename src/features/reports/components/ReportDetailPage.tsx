import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiExternalLink,
  FiMail,
  FiPhone,
  FiTrash2,
  FiVideo,
} from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import Button from "@/components/generic/Button";
import ConfirmModal from "@/components/generic/ConfirmModal";
import FormTextarea from "@/components/generic/FormTextArea";
import placeholderImage from "@/assets/listing-header.jpg";
import NotFoundState from "@/components/generic/NotFoundState";
import PageLoader from "@/components/generic/PageLoader";
import {
  useReport,
  useReleaseReport,
  useRefundReport,
  useDelistAndRefundReport,
} from "../queries";
import { useDelistListing } from "@/features/listings/queries";
import { showToast } from "@/lib/utils/toast";
import type {
  ReportDetail,
  ReportParty,
  ReportResolutionOutcome,
  ReportWorkflowPhase,
} from "../types";
import { getInitials } from "@/lib/utils/getInitials";
import ContactPhoneModal from "./ContactPhoneModal";

const NOT_IN_API_YET = "—";

const statusPillClass: Record<string, string> = {
  new: "bg-blue-50 text-brand-blue dark:bg-blue-950 dark:text-blue-400",
  investigating:
    "bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400",
  disputed: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
  dismissed:
    "bg-gray-50 text-brand-gray-light dark:bg-gray-800 dark:text-gray-400",
  resolved: "bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400",
};

const partyStatusPillClass: Record<string, string> = {
  active: "bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400",
  pending: "bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400",
  suspended: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
  banned: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
};

const statusFallback =
  "bg-gray-50 text-brand-gray-light dark:bg-gray-800 dark:text-gray-400";

const RESOLUTION_OUTCOMES: {
  value: ReportResolutionOutcome;
  label: string;
  description: string;
}[] = [
  {
    value: "delist-and-refund",
    label: "Uphold report — delist listing",
    description:
      "The listing is taken down and the buyer is refunded in full from escrow.",
  },
  {
    value: "refund",
    label: "Uphold report — refund buyer",
    description:
      "Escrow is released to the buyer. The listing stays up.",
  },
  {
    value: "release",
    label: "Side with seller — dismiss report",
    description:
      "The evidence doesn't support the claim. Escrow is released back to the seller.",
  },
];

function formatStatus(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(iso?: string | null) {
  if (!iso) return NOT_IN_API_YET;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return NOT_IN_API_YET;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso?: string | null) {
  if (!iso) return NOT_IN_API_YET;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return NOT_IN_API_YET;
  return `${date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} · ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}

function getPhase(
  report: ReportDetail,
  overridden: boolean,
): ReportWorkflowPhase {
  if (report.status === "dismissed") return "dismissed";
  if (report.status === "resolved") return "resolved";
  if (report.status === "disputed") return "seller_disputed";
  return overridden ? "admin_override" : "awaiting_seller";
}

export default function ReportDetailPage() {
  const { reportCode } = useParams<{ reportCode: string }>();

  const { data: report, isLoading, isError } = useReport(reportCode);

  if (isLoading) return <PageLoader />;
  if (isError || !report) {
    return (
      <NotFoundState
        icon={<FiAlertCircle className="w-5 h-5" />}
        message="Report not found."
      />
    );
  }

  return <ReportDetailView report={report} />;
}

function ReportDetailView({ report }: { report: ReportDetail }) {
  const navigate = useNavigate();
  const resolutionRef = useRef<HTMLDivElement>(null);

  const [overridden, setOverridden] = useState(false);
  const [selectedOutcome, setSelectedOutcome] =
    useState<ReportResolutionOutcome | null>(null);
  const [note, setNote] = useState("");
  const [callingParty, setCallingParty] = useState<ReportParty | null>(null);
  const [dismissing, setDismissing] = useState(false);
  const [delisting, setDelisting] = useState(false);
  const [justResolved, setJustResolved] = useState<{
    outcomeLabel: string;
    note: string;
    resolvedAt: string;
  } | null>(null);

  const { mutateAsync: release, isPending: isReleasing } = useReleaseReport();
  const { mutateAsync: refund, isPending: isRefunding } = useRefundReport();
  const { mutateAsync: delistAndRefund, isPending: isDelistingAndRefunding } =
    useDelistAndRefundReport();
  const { mutateAsync: delistListing, isPending: isDelisting } =
    useDelistListing();

  const isSubmittingResolution = isReleasing || isRefunding || isDelistingAndRefunding;

  const { listing, reporter, accusedUser, sellerDispute } = report;
  const isClosed = report.status === "resolved" || report.status === "dismissed";
  const phase = getPhase(report, overridden);

  const unlockResolution = (preselect?: ReportResolutionOutcome) => {
    setOverridden(true);
    if (preselect) setSelectedOutcome(preselect);
    requestAnimationFrame(() => {
      resolutionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const resolveWith = (outcome: ReportResolutionOutcome) => {
    const label =
      RESOLUTION_OUTCOMES.find((o) => o.value === outcome)?.label ?? outcome;

    const call =
      outcome === "release"
        ? release({ reportId: report._id })
        : outcome === "delist-and-refund"
          ? delistAndRefund({ reportId: report._id, payload: { reason: note.trim() } })
          : refund({ reportId: report._id, payload: { reason: note.trim() } });

    showToast.promise(
      call.then(() => {
        setJustResolved({
          outcomeLabel: label,
          note: outcome === "release" ? "" : note.trim(),
          resolvedAt: new Date().toISOString(),
        });
      }),
      {
        loading: "Submitting resolution...",
        success: `${report.slug} resolved.`,
        error: "Couldn't submit resolution.",
      },
    );
  };

  const handleDismiss = () => {
    showToast.promise(
      release({ reportId: report._id }).then(() => {
        setJustResolved({
          outcomeLabel: "Side with seller — dismiss report",
          note: "",
          resolvedAt: new Date().toISOString(),
        });
        setDismissing(false);
      }),
      {
        loading: `Dismissing ${report.slug}...`,
        success: `${report.slug} dismissed.`,
        error: "Couldn't dismiss report.",
      },
    );
  };

  const handleDelistListing = () => {
    if (!listing) return;
    showToast.promise(
      delistListing(listing._id).then(() => setDelisting(false)),
      {
        loading: `Delisting ${listing.title}...`,
        success: `${listing.title} has been delisted.`,
        error: "Couldn't delist listing.",
      },
    );
  };

  return (
    <div>
      <button
        onClick={() => navigate("/reports")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Reports
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-[#FAFAFA] dark:bg-gray-900/50 rounded-xl p-4 mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1D2939] dark:text-gray-100 tracking-wide">
              Report {report.slug}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                statusPillClass[report.status] ?? statusFallback
              }`}
            >
              {formatStatus(report.status)}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {report.slug} · Reported {formatDate(report.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isClosed && (
            <>
              <Button
                onClick={() => unlockResolution()}
                leftIcon={<BsCheckCircleFill className="w-4 h-4" />}
                bgColor="bg-green-600 hover:bg-green-700"
                textColor="text-white"
                borderColor="border-transparent"
              >
                Decide Outcome
              </Button>
              <Button onClick={() => setDismissing(true)}>Dismiss</Button>
            </>
          )}
          <Button
            onClick={() => setDelisting(true)}
            disabled={!listing}
            leftIcon={<FiTrash2 className="w-4 h-4" />}
            bgColor="bg-[#FFFBFA] dark:bg-gray-900"
            textColor="text-[#F04438]"
            borderColor="border-[#F04438] dark:border-red-900"
          >
            Delist Listing
          </Button>
        </div>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* reported listing */}
          <div className="detail-section-card border-none">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
                Reported Listing
              </p>
              <div className="flex items-center gap-3">
                {report.transaction && (
                  <button
                    type="button"
                    onClick={() => navigate(`/transactions/${report.transaction}`)}
                    className="text-xs text-brand-blue hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Transaction <FiExternalLink className="w-3 h-3" />
                  </button>
                )}
                {listing && (
                  <button
                    type="button"
                    onClick={() => navigate(`/listings/${listing.slug}`)}
                    className="text-xs text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View Listing <FiExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {listing ? (
              <div className="flex items-center gap-3">
                <img
                  src={listing.mainImage || placeholderImage}
                  className="w-12 h-12 rounded-lg shrink-0 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                    {listing.title}
                  </p>
                  <p className="text-xs text-brand-gray-light">
                    {listing.slug} · Reported {formatDate(report.createdAt)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-brand-gray-light">
                This report isn't tied to a listing.
              </p>
            )}
          </div>

          {/* dispute thread */}
          <div className="detail-section-card border-none">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
                Dispute Thread
              </p>
              <p className="text-xs text-brand-gray-light">
                {phase === "awaiting_seller" && "Seller has not responded yet"}
                {phase === "admin_override" && "Decided without the seller"}
                {(phase === "seller_disputed" ||
                  (phase === "resolved" && sellerDispute)) &&
                  "2 messages · both parties visible"}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {reporter && (
                <ThreadMessage
                  name={reporter.name}
                  tag="BUYER · REPORTER"
                  tagClass="text-brand-blue bg-[#EFF6FF] dark:bg-blue-950 dark:text-blue-400"
                  timestamp={formatDateTime(report.createdAt)}
                  message={report.reason}
                />
              )}

              {sellerDispute ? (
                <ThreadMessage
                  name={accusedUser?.name ?? "Seller"}
                  tag="SELLER · RESPONSE"
                  tagClass="text-[#DC6803] bg-[#FFFAEB] dark:bg-amber-950 dark:text-amber-400"
                  timestamp={formatDateTime(report.updatedAt)}
                  message={sellerDispute.disputeClaim}
                >
                  {(sellerDispute.evidenceImages.length > 0 ||
                    sellerDispute.evidenceVideo) && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {sellerDispute.evidenceImages.map((image) => (
                        <a
                          key={image.publicId}
                          href={image.secureUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            src={image.secureUrl}
                            className="w-14 h-14 rounded-lg object-cover border border-gray-100 dark:border-gray-800"
                          />
                        </a>
                      ))}
                      {sellerDispute.evidenceVideo && (
                        <a
                          href={sellerDispute.evidenceVideo.secureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs text-brand-gray-dark dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <FiVideo className="w-3.5 h-3.5" /> Evidence video
                        </a>
                      )}
                    </div>
                  )}
                </ThreadMessage>
              ) : phase === "awaiting_seller" || phase === "admin_override" ? (
                <div className="border border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 bg-brand-gray-light">
                      {getInitials(accusedUser?.name ?? "Seller")}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                        {accusedUser?.name ?? "Seller"}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide text-[#B54708] bg-[#FFFAEB] dark:bg-amber-950 dark:text-amber-400">
                        Seller · No Response Yet
                      </span>
                    </div>
                  </div>

                  {phase === "admin_override" ? (
                    <p className="text-sm text-brand-gray-light">
                      Overridden by an admin decision below.
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                        Seller is choosing whether to accept &amp; refund or
                        dispute this report. Accepting refunds the buyer in
                        full and closes the case. Disputing sends their side
                        to this thread for you to judge.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          onClick={() =>
                            showToast.info("Reminder sent", {
                              description: `${accusedUser?.name ?? "The seller"} has been reminded to respond.`,
                            })
                          }
                          bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
                          textColor="text-white"
                          borderColor="border-transparent"
                        >
                          Send Reminder
                        </Button>
                        <Button onClick={() => unlockResolution()}>
                          Decide without seller
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          {/* resolution */}
          <div ref={resolutionRef} className="detail-section-card border-none">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
                Resolution
              </p>
              <p className="text-xs text-brand-gray-light">
                {phase === "awaiting_seller" && "Locked · seller window open"}
                {(phase === "admin_override" || phase === "seller_disputed") &&
                  "Pick an outcome and write a note"}
                {isClosed && "Closed"}
              </p>
            </div>

            {phase === "awaiting_seller" && (
              <div className="flex items-start gap-3 rounded-lg border border-[#FEC84B] dark:border-amber-900 bg-[#FFFAEB] dark:bg-amber-950/30 p-4">
                <FiAlertCircle className="w-5 h-5 text-[#B54708] dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-[#B54708] dark:text-amber-400">
                    Held until the seller responds
                  </p>
                  <p className="text-xs text-brand-gray-dark dark:text-gray-300 mt-1">
                    If the seller accepts, the buyer is refunded and this
                    case closes with no admin decision. If they dispute it,
                    their statement lands in the thread above and this panel
                    unlocks. You can override this with "Decide without
                    seller".
                  </p>
                </div>
              </div>
            )}

            {(phase === "admin_override" || phase === "seller_disputed") && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {RESOLUTION_OUTCOMES.map((outcome) => {
                    const selected = selectedOutcome === outcome.value;
                    return (
                      <button
                        key={outcome.value}
                        type="button"
                        onClick={() => setSelectedOutcome(outcome.value)}
                        className={`flex items-start gap-2.5 text-left rounded-lg border p-3 transition-colors cursor-pointer ${
                          selected
                            ? "border-brand-blue bg-blue-50 dark:bg-blue-950/30"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        }`}
                      >
                        <span
                          className={`mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                            selected
                              ? "border-brand-blue"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {selected && (
                            <span className="w-2 h-2 rounded-full bg-brand-blue" />
                          )}
                        </span>
                        <span>
                          <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                            {outcome.label}
                          </p>
                          <p className="text-xs text-brand-gray-light mt-1">
                            {outcome.description}
                          </p>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedOutcome !== "release" && (
                  <FormTextarea
                    label="Resolution Note"
                    required
                    rows={3}
                    placeholder="Summarise the evidence you relied on and what each party must do next. This is sent to both parties."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={() => selectedOutcome && resolveWith(selectedOutcome)}
                    disabled={
                      !selectedOutcome ||
                      (selectedOutcome !== "release" && !note.trim()) ||
                      isSubmittingResolution
                    }
                    bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
                    textColor="text-white"
                    borderColor="border-transparent"
                  >
                    {isSubmittingResolution ? "Submitting..." : "Submit Resolution"}
                  </Button>
                </div>
              </div>
            )}

            {isClosed &&
              (justResolved ? (
                <ResolvedBanner
                  variant="admin"
                  heading={justResolved.outcomeLabel}
                  note={justResolved.note}
                  resolvedAt={justResolved.resolvedAt}
                />
              ) : report.status === "dismissed" ? (
                <ResolvedBanner
                  variant="dismissed"
                  heading="Report dismissed"
                  resolvedAt={report.updatedAt}
                />
              ) : (
                <ResolvedBanner
                  variant="admin"
                  heading="Report resolved"
                  resolvedAt={report.updatedAt}
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <PartyCard
            title="Reporter"
            party={reporter}
            statLabel="Prior Reports Filed"
            statValue={reporter?.priorReportsFiled ?? NOT_IN_API_YET}
            onCall={setCallingParty}
          />
          <PartyCard
            title="Seller"
            party={accusedUser}
            statLabel="Reports Against"
            statValue={
              accusedUser?.reportsAgainstCount != null
                ? `${accusedUser.reportsAgainstCount} in ${accusedUser.reportsAgainstWindowDays ?? "—"} Days`
                : NOT_IN_API_YET
            }
            onCall={setCallingParty}
          />
        </div>
      </div>

      {callingParty && (
        <ContactPhoneModal
          phone={callingParty.phone}
          onClose={() => setCallingParty(null)}
        />
      )}

      {dismissing && (
        <ConfirmModal
          title={`Dismiss ${report.slug}?`}
          message="Escrow is released back to the seller and this report is closed. This can't be undone."
          confirmLabel="Dismiss Report"
          isSubmitting={isReleasing}
          onClose={() => setDismissing(false)}
          onConfirm={handleDismiss}
        />
      )}

      {delisting && listing && (
        <ConfirmModal
          title="Delist this listing?"
          message={`${listing.title} will be taken down immediately. This is independent of how this report gets resolved.`}
          confirmLabel="Delist Listing"
          isSubmitting={isDelisting}
          onClose={() => setDelisting(false)}
          onConfirm={handleDelistListing}
        />
      )}
    </div>
  );
}

function ThreadMessage({
  name,
  tag,
  tagClass,
  timestamp,
  message,
  children,
}: {
  name: string;
  tag: string;
  tagClass: string;
  timestamp: string;
  message: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
        style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
      >
        {getInitials(name)}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
            {name}
          </p>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${tagClass}`}
          >
            {tag}
          </span>
          <span className="text-xs text-brand-gray-light">{timestamp}</span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 mt-1.5">
          <p className="text-sm text-brand-gray-dark dark:text-gray-300">
            {message}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

function ResolvedBanner({
  variant,
  heading,
  note,
  resolvedAt,
}: {
  variant: "admin" | "dismissed";
  heading: string;
  note?: string;
  resolvedAt?: string | null;
}) {
  const isDismissed = variant === "dismissed";
  return (
    <div
      className={`rounded-lg p-4 ${
        isDismissed
          ? "bg-gray-50 dark:bg-gray-800/50"
          : "bg-[#F6FEF9] dark:bg-green-950/30"
      }`}
    >
      <div className="flex items-center gap-2">
        <BsCheckCircleFill
          className={`w-4 h-4 shrink-0 ${
            isDismissed
              ? "text-brand-gray-light"
              : "text-[#027A48] dark:text-green-400"
          }`}
        />
        <p
          className={`text-sm font-semibold ${
            isDismissed
              ? "text-brand-gray-dark dark:text-gray-200"
              : "text-[#027A48] dark:text-green-400"
          }`}
        >
          {heading}
        </p>
      </div>
      <p className="text-xs text-brand-gray-light mt-1">
        {formatDateTime(resolvedAt)}
      </p>
      {note && (
        <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-3">
          {note}
        </p>
      )}
    </div>
  );
}

function PartyCard({
  title,
  party,
  statLabel,
  statValue,
  onCall,
}: {
  title: string;
  party?: ReportParty | null;
  statLabel: string;
  statValue: ReactNode;
  onCall: (party: ReportParty) => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="detail-section-card border-none">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
          {title}
        </p>
        {party && (
          <button
            type="button"
            onClick={() => navigate(`/users/${party._id}`)}
            className="text-xs text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            View User <FiExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {!party ? (
        <p className="text-sm text-brand-gray-light">
          No {title.toLowerCase()} attached to this report.
        </p>
      ) : (
        <>
          <div className="flex items-center gap-2.5 mb-3">
            <span
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
              style={{ background: "linear-gradient(135deg, #D19E00, #2563EB)" }}
            >
              {getInitials(party.name)}
            </span>
            <div>
              <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                {party.name}
              </p>
              <p className="text-xs text-brand-gray-light">
                {party.slug} · {party.email}
              </p>
            </div>
          </div>

          <div className="profile-info-row">
            <span className="profile-info-label">Status</span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                partyStatusPillClass[party.status] ?? statusFallback
              }`}
            >
              {formatStatus(party.status)}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Member Since</span>
            <span className="profile-info-value">
              {formatDate(party.createdAt)}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">Rating</span>
            <span className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < Math.round(party.rating)
                      ? "text-amber-400"
                      : "text-gray-200"
                  }
                >
                  ★
                </span>
              ))}
            </span>
          </div>
          <div className="profile-info-row">
            <span className="profile-info-label">{statLabel}</span>
            <span className="profile-info-value">{statValue}</span>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              onClick={() => (window.location.href = `mailto:${party.email}`)}
              disabled={!party.email}
              leftIcon={<FiMail className="w-4 h-4 text-[#98A2B3]" />}
              className="flex-1 justify-center"
            >
              Send Email
            </Button>
            <Button
              onClick={() => onCall(party)}
              disabled={!party.phone}
              leftIcon={<FiPhone className="w-4 h-4" />}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              className="flex-1 justify-center"
            >
              Call Now
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
