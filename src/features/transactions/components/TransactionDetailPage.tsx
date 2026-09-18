import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPrinter,
  FiClock,
  FiTrash2,
  FiFileText,
  FiBell,
  FiCheckCircle,
  FiAlertTriangle,
  // FiCheck,
  // FiDollarSign,
  FiEdit3,
  FiXCircle,
  FiInfo,
  FiPauseCircle,
} from "react-icons/fi";
import { HiClock } from "react-icons/hi2";
import ImageGallery from "@/components/generic/ImageGallery";
import ListingLocationMap from "@/components/generic/ListingLocationMap";
import Button from "@/components/generic/Button";
import PageLoader from "@/components/generic/PageLoader";
import SendReminderModal from "./SendReminderModal";
import avatarPlaceholder from "@/assets/avatar.svg";
import type {
  TransactionActivityLogEntry,
  TransactionNoteRecord,
} from "../types";
import {
  useTransaction,
  useAddTransactionNote,
  useUpdateTransactionNote,
  useDeleteTransactionNote,
  useSendInspectionReminder,
} from "../queries";
import { useMe } from "@/features/auth/queries";
import {
  statusPillClass as realStatusPillClass,
  statusFallback,
  currency,
  formatLabel,
  formatDate,
  formatDateTime,
  formatCountdown,
} from "../statusStyles";
import ReceiptModal from "./ReceiptModal";
import { buildReceiptFromRecord } from "../receipt";
import RefundDetailsModal from "./RefundDetailsModal";
import { buildRefundSummary } from "../refund";
import NotFoundState from "@/components/generic/NotFoundState";
import ConfirmModal from "@/components/generic/ConfirmModal";
import { TbReceipt } from "react-icons/tb";
import RowActionsMenu, {
  type RowAction,
} from "@/components/generic/RowActionsMenu";
import {
  FiEye,
  FiDownload as FiDownloadIcon,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { FaRotate, FaRotateRight } from "react-icons/fa6";
import { LuNotepadText } from "react-icons/lu";
import { RiLockPasswordFill } from "react-icons/ri";
import layers from "@/assets/icons/layer-black.svg";
import { showToast } from "@/lib/utils/toast";
import { BsCheckCircleFill } from "react-icons/bs";
import { AiFillDollarCircle } from "react-icons/ai";

const STAGE_SEQUENCE_WITH_ESCROW = [
  "Checkout",
  "Escrow Held",
  "Inspection",
  "Buyer's Decision",
  "Resolution",
];
const STAGE_SEQUENCE_NO_ESCROW = ["Checkout", "Buyer's Decision"];

const STAGE_ALIASES: Record<string, string> = {
  inspection: "Inspection",
  resolved: "Resolution",
  "refund processed": "Resolution",
  "buyer's decision": "Buyer's Decision",
  checkout: "Checkout",
  "escrow held": "Escrow Held",
};

function buildStages(currentStage: string, hasEscrow: boolean) {
  const sequence = hasEscrow
    ? STAGE_SEQUENCE_WITH_ESCROW
    : STAGE_SEQUENCE_NO_ESCROW;
  const normalized = STAGE_ALIASES[currentStage.trim().toLowerCase()];
  const idx = normalized ? sequence.indexOf(normalized) : -1;

  return sequence.map((label, i) => ({
    label,
    state: (idx === -1
      ? i === 0
        ? "current"
        : "pending"
      : i < idx
        ? "completed"
        : i === idx
          ? "current"
          : "pending") as "completed" | "current" | "pending",
  }));
}

function findActivityMetadata(
  activityLog: TransactionActivityLogEntry[],
  key: string,
) {
  const entry = activityLog.find((e) => e.metadata && key in e.metadata);
  return entry?.metadata?.[key];
}

function findActivityEvent(
  activityLog: TransactionActivityLogEntry[],
  eventSubstring: string,
) {
  return activityLog.find((e) => e.event.includes(eventSubstring));
}

// function camelToTitle(key: string) {
//   const spaced = key.replace(/([A-Z])/g, " $1").trim();
//   return spaced.charAt(0).toUpperCase() + spaced.slice(1);
// }

// function describeMetadataValue(key: string, value: unknown): string {
//   if (typeof value === "number") {
//     if (/kobo/i.test(key)) return currency.format(value / 100);
//     if (/amount|fee|payout/i.test(key)) return currency.format(value);
//     if (/days/i.test(key)) return `${value} day${value === 1 ? "" : "s"}`;
//     return String(value);
//   }
//   if (typeof value === "string" && /date|at$/i.test(key)) {
//     return formatDateTime(value);
//   }
//   return String(value);
// }

// function describeMetadata(metadata: Record<string, unknown>) {
//   return Object.entries(metadata)
//     .map(([key, value]) => `${camelToTitle(key)}: ${describeMetadataValue(key, value)}`)
//     .join(" · ");
// }

function channelLabel(channel: string) {
  if (channel.toLowerCase() === "sms") return "SMS";
  return formatLabel(channel);
}

const tabsList = [
  "Overview",
  "Payment & Escrow",
  // "Timeline",
  "Communication",
  "Inspection",
  "Activity Log",
  "Notes",
  "Location",
];

function StageStepper({ stages }: { stages: { label: string; state: "completed" | "current" | "pending" }[] }) {
  return (
    <div className="flex items-start">
      {stages.map((stage, i) => (
        <div key={stage.label} className="relative flex-1">
          {/* line segment before the first circle */}
          {i === 0 && (
            <span
              className={`absolute top-4 w-full h-px ${
                stage.state === "completed"
                  ? "bg-brand-blue"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              style={{ marginRight: "16px" }}
            />
          )}

          <div className="flex flex-col items-center">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border relative z-10 ${
                stage.state === "completed"
                  ? "bg-brand-blue border-brand-blue text-white"
                  : stage.state === "current"
                    ? "bg-white dark:bg-gray-900 border-brand-blue text-brand-blue"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-400"
              }`}
            >
              {stage.state === "completed" ? (
                <BsCheckCircleFill className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </span>
            <span className="text-xs text-brand-gray-light mt-1 whitespace-nowrap">
              {stage.label}
            </span>
          </div>

          {/* line segment after this circle, connecting to the next */}
          {i < stages.length - 1 && (
            <span
              className={`absolute top-4 w-full h-px ${
                stage.state === "completed"
                  ? "bg-brand-blue"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              style={{ marginLeft: "16px" }}
            />
          )}

          {/* line segment after the last circle */}
          {i === stages.length - 1 && (
            <span
              className={`absolute top-4 w-full h-px ${
                stage.state === "completed"
                  ? "bg-brand-blue"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
              style={{ marginLeft: "16px" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function TransactionDetailPage() {
  const { transactionId: routeParam } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { data: me } = useMe();

  const { data: txn, isLoading, isError } = useTransaction(routeParam);

  const { mutate: sendReminder, isPending: isSendingReminder } =
    useSendInspectionReminder(txn?._id);
  const { mutate: addNote, isPending: isAddingNote } = useAddTransactionNote(
    txn?._id,
  );
  const { mutate: updateNote, isPending: isUpdatingNote } =
    useUpdateTransactionNote();
  const { mutateAsync: deleteNoteAsync } = useDeleteTransactionNote();
  // const { mutate: exportTransactionMutate, isPending: isExporting } =
  //   useExportTransaction();

  const [activeTab, setActiveTab] = useState("Overview");
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  if (isLoading) return <PageLoader />;

  if (isError || !txn) {
    return (
      <NotFoundState
        icon={<FiFileText className="w-5 h-5" />}
        message="Transaction not found."
      />
    );
  }

  const listing = txn.listing;
  const buyer = txn.buyer;
  const seller = txn.seller;
  const hasEscrow = !!txn.escrow;
  const stages = buildStages(
    txn.insights?.currentStage ?? txn.currentStage ?? "",
    hasEscrow,
  );
  const countdown = formatCountdown(txn.inspectionDeadlineAt);

  const platformFee =
    txn.commissionAmount ?? Math.round((txn.amount * txn.commissionPercentage) / 100);
  const sellerReceivable =
    txn.sellerPayoutAmount ??
    (txn.commissionAmount != null
      ? txn.amount - txn.commissionAmount - txn.gatewayProcessingFee
      : null);

  const refundAmount = findActivityMetadata(txn.activityLog, "refundAmount") as
    | number
    | undefined;
  const commissionOnRefund = (findActivityMetadata(
    txn.activityLog,
    "commissionAmount",
  ) ?? txn.commissionAmount) as number | undefined;
  const cancelEvent = findActivityEvent(txn.activityLog, "cancel");
  const stalledThresholdDays = findActivityMetadata(
    txn.activityLog,
    "thresholdDays",
  ) as number | undefined;
  const refundSummary = buildRefundSummary(txn, refundAmount, commissionOnRefund);

  const productImages = listing
    ? [
        ...listing.images.map((img) => ({
          id: img.publicId,
          url: img.secureUrl || img.url,
        })),
        ...(listing.video
          ? [
              {
                id: listing.video.publicId,
                url: listing.video.secureUrl || listing.video.url,
                posterUrl: (listing.video.secureUrl || listing.video.url).replace(
                  /\.[^.]+$/,
                  ".jpg",
                ),
                isVideo: true,
              },
            ]
          : []),
      ]
    : [];

  const handleSendReminder = (data: {
    type: string;
    channel: string;
    message?: string;
  }) => {
    sendReminder(
      {
        reminderType: data.type.toLowerCase().replace(/ /g, "_"),
        channel: data.channel.toLowerCase(),
        message: data.message,
      },
      {
        onSuccess: () => {
          setReminderModalOpen(false);
          showToast.success("Reminder sent successfully!", {
            description: `A reminder has been sent to ${buyer?.name ?? "the buyer"} to complete inspection.`,
          });
        },
        onError: () => {
          showToast.error("Couldn't send reminder", {
            description: "Please try again in a moment.",
          });
        },
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

  // const handleExportTransaction = () => {
  //   exportTransactionMutate(txn._id, {
  //     onSuccess: (blob) => {
  //       const url = window.URL.createObjectURL(blob);
  //       const link = document.createElement("a");
  //       link.href = url;
  //       const extension = blob.type.includes("pdf")
  //         ? "pdf"
  //         : blob.type.includes("csv")
  //           ? "csv"
  //           : blob.type.includes("json")
  //             ? "json"
  //             : "";
  //       link.download = `${txn.reference}-export${extension ? `.${extension}` : ""}`;
  //       document.body.appendChild(link);
  //       link.click();
  //       link.remove();
  //       window.URL.revokeObjectURL(url);
  //     },
  //     onError: () => showToast.error("Couldn't export transaction"),
  //   });
  // };

  const moreActions: RowAction[] = [
    {
      label: "Download Receipt",
      icon: <FiDownloadIcon className="w-4 h-4" />,
      onClick: () => setReceiptModalOpen(true),
    },
    // {
    //   label: isExporting ? "Exporting..." : "Export Transaction",
    //   icon: <TbFileExport className="w-4 h-4" />,
    //   onClick: handleExportTransaction,
    // },
  ];

  if (listing) {
    moreActions.push({
      label: "View Item",
      icon: <FiEye className="w-4 h-4" />,
      onClick: () => navigate(`/listings/${listing.slug}`),
    });
  }
  if (buyer) {
    moreActions.push({
      label: "View Buyer Profile",
      icon: <FiUser className="w-4 h-4" />,
      onClick: () => navigate(`/users/${buyer.id}`),
    });
  }
  if (seller) {
    moreActions.push({
      label: "View Seller Profile",
      icon: <FiUser className="w-4 h-4" />,
      onClick: () => navigate(`/users/${seller.id}`),
    });
  }
  if (buyer) {
    moreActions.push({
      label: "Contact Buyer",
      icon: <FiMail className="w-4 h-4" />,
      onClick: () => {
        window.location.href = `mailto:${buyer.email}`;
      },
    });
  }
  if (seller) {
    moreActions.push({
      label: "Contact Seller",
      icon: <FiMail className="w-4 h-4" />,
      onClick: () => {
        window.location.href = `mailto:${seller.email}`;
      },
    });
  }

  // if (txn.status !== "refunded" && txn.status !== "completed") {
  //   moreActions.push({
  //     label: "Refund",
  //     icon: <HiOutlineReceiptRefund className="w-4 h-4" />,
  //     variant: "danger",
  //     onClick: () =>
  //       showToast.error("Refund isn't wired up yet", {
  //         description:
  //           "There's no refund endpoint available for this transaction yet.",
  //       }),
  //   });
  // }

  const isModalOpen = reminderModalOpen || receiptModalOpen || refundModalOpen;

  return (
    <div className={isModalOpen ? undefined : "print-area"}>
      {/* breadcrumb */}
      <button
        onClick={() => navigate("/transactions")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Transactions
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-[#FAFAFA] dark:bg-gray-900/50 rounded-xl p-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl tracking-wide font-bold text-[#1D2939] dark:text-gray-100">
              {txn.reference}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${realStatusPillClass[txn.status] ?? statusFallback}`}
            >
              {formatLabel(txn.status)}
            </span>
          </div>
          <span className="text-xs text-brand-gray-light mt-0.5">
            Created
            <p className="text-brand-gray-dark">{formatDateTime(txn.createdAt)}</p>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            leftIcon={<TbReceipt className="w-4 h-4" />}
            onClick={() => setReceiptModalOpen(true)}
          >
            Receipt
          </Button>
          <Button
            leftIcon={<FiPrinter className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <span className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
          <RowActionsMenu
            actions={moreActions}
            menuWidth={200}
            triggerClassName="w-9 h-9 rounded-full dark:text-white border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800"
          />
        </div>
      </div>

      {/* status banner */}
      {(txn.status === "escrow_active" ||
        txn.status === "awaiting_inspection" ||
        txn.status === "stalled") &&
        txn.inspectionStatus === "awaiting" && (
          <div className="flex items-center justify-between bg-[#FFFAEB] dark:bg-amber-950 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#FEF3C6] dark:bg-amber-950 rounded-md flex items-center justify-center p-2 shrink-0">
                {txn.status === "stalled" ? (
                  <FiPauseCircle className="w-4 h-4 text-[#E17100] dark:text-amber-400" />
                ) : (
                  <FiClock className="w-4 h-4 text-[#E17100] dark:text-amber-400" />
                )}
              </span>

              <div>
                <p className="text-sm font-medium text-[#7B3306] dark:text-amber-300">
                  {txn.status === "stalled"
                    ? "This transaction has stalled and needs attention."
                    : "Waiting for buyer to inspect this item."}
                </p>
                <p className="text-xs text-[#BB4D00] dark:text-amber-400">
                  {txn.status === "stalled"
                    ? stalledThresholdDays
                      ? `No activity recorded for over ${stalledThresholdDays} day(s).`
                      : "The system flagged this transaction as inactive."
                    : txn.inspectionExtended
                      ? `Inspection window extended — ends ${formatDateTime(txn.inspectionExtensionEndDate)}.`
                      : countdown
                        ? `${countdown.label} remaining before the inspection window closes.`
                        : "No inspection deadline has been set."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {countdown && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-[#FEC84B] dark:border-amber-700 bg-amber-100 dark:bg-amber-900 text-[#BB4D00] dark:text-amber-300">
                  {countdown.label} remaining
                </span>
              )}
              <Button
                textColor="#111827 dark:text-white"
                leftIcon={<FiBell className="w-4 h-4" />}
                onClick={() => setReminderModalOpen(true)}
                disabled={isSendingReminder}
              >
                Send Reminder
              </Button>
            </div>
          </div>
        )}

      {txn.status === "completed" && (
        <div className="flex items-center justify-between bg-[#ECFDF3] dark:bg-green-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#D0FAE5] dark:bg-green-950 rounded-md flex items-center justify-center p-2 shrink-0">
              <FiCheckCircle className="w-4 h-4 text-[#009966] dark:text-green-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#004F3B] dark:text-green-400">
                This transaction has been completed successfully.
              </p>
              <p className="text-xs text-[#007A55] dark:text-green-500">
                Escrow was released to the seller
                {txn.escrow?.status === "released"
                  ? ` on ${formatDateTime(txn.updatedAt)}`
                  : ""}
                .
              </p>
            </div>
          </div>

          <Button
            textColor="#475467"
            leftIcon={<TbReceipt className="w-4 h-4" />}
            onClick={() => setReceiptModalOpen(true)}
          >
            View Receipt
          </Button>
        </div>
      )}

      {txn.status === "disputed" && (
        <div className="flex items-center justify-between bg-[#FEF3F2] dark:bg-red-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFE2E2] dark:bg-red-950 rounded-md flex items-center justify-center p-2 shrink-0">
              <FiAlertTriangle className="w-4 h-4 text-[#E7000B] dark:text-red-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#82181A] dark:text-red-400">
                This transaction requires immediate review.
              </p>
              <p className="text-xs text-[#C10007] dark:text-red-500">
                {txn.disputeStatus
                  ? `Dispute status: ${formatLabel(txn.disputeStatus)}. `
                  : ""}
                Review the buyer and seller statements and evidence in the
                Inspection tab.
              </p>
            </div>
          </div>

          <Button
            bgColor="bg-transparent"
            textColor="text-[#F04438]"
            borderColor="border-[#FECDCA] dark:border-red-900"
            leftIcon={<FiEye className="w-4 h-4" />}
            onClick={() => setActiveTab("Inspection")}
          >
            Review Evidence
          </Button>
        </div>
      )}

      {txn.status === "refunded" && (
        <div className="flex items-center justify-between bg-[#F5F3FF] dark:bg-purple-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#EDE9FE] dark:bg-purple-900 rounded-md flex items-center justify-center p-2 shrink-0">
              <FaRotate className="w-4 h-4 text-[#7F22FE] dark:text-purple-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#4D179A] dark:text-purple-300">
                Funds have been returned to the buyer.
              </p>
              <p className="text-xs text-[#7008E7] dark:text-purple-400">
                Refund of{" "}
                {currency.format(
                  refundSummary.refundAmount ?? txn.escrow?.amount ?? txn.amount,
                )}
                {refundSummary.refundedAt
                  ? ` was processed on ${formatDateTime(refundSummary.refundedAt)}`
                  : " was processed"}
                .
              </p>
            </div>
          </div>

          <Button
            leftIcon={<FaRotateRight className="w-4 h-4" />}
            onClick={() => setRefundModalOpen(true)}
          >
            View Refund
          </Button>
        </div>
      )}

      {txn.status === "cancelled" && (
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center p-2 shrink-0">
              <FiXCircle className="w-4 h-4 text-brand-gray-dark dark:text-gray-300" />
            </span>
            <div>
              <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-200">
                This transaction was cancelled before completion.
              </p>
              <p className="text-xs text-brand-gray-light">
                {cancelEvent?.label ?? "Cancelled"} on{" "}
                {formatDateTime(txn.updatedAt)}.
              </p>
            </div>
          </div>
        </div>
      )}

      {txn.status === "pending_payment" && (
        <div className="flex items-center justify-between bg-[#F0F9FF] dark:bg-blue-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#E0F2FE] dark:bg-blue-900 rounded-md flex items-center justify-center p-2 shrink-0">
              <FiInfo className="w-4 h-4 text-brand-blue dark:text-blue-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-brand-blue dark:text-blue-300">
                Awaiting payment from the buyer.
              </p>
              <p className="text-xs text-brand-blue/80 dark:text-blue-400">
                Escrow will be created once payment is confirmed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {currency.format(txn.insights?.transactionAmount ?? txn.amount)}
          </p>
          <p className="detail-stat-label">
            <AiFillDollarCircle className="w-3.5 h-3.5" /> Transaction Amount
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {currency.format(txn.insights?.escrowAmount ?? txn.escrow?.amount ?? 0)}
          </p>
          <p className="detail-stat-label">
            <RiLockPasswordFill className="w-3.5 h-3.5" /> Escrow Amount
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {txn.insights?.transactionDuration ?? "—"}
          </p>
          <p className="detail-stat-label">
            <HiClock className="w-3.5 h-3.5" /> Transaction Duration
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">
            {txn.insights?.currentStage ?? txn.currentStage ?? "—"}
          </p>
          <p className="detail-stat-label">
            <img src={layers} className="w-4 h-4" /> Current Stage
          </p>
        </div>
      </div>

      {/* stepper */}
      <div className="detail-section-card border-none mb-4">
        <StageStepper stages={stages} />
        {txn.inspectionDeadlineAt && txn.inspectionStatus === "awaiting" && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-[#F79009]" />
              <p className="text-xs text-brand-gray-light">
                Inspection Deadline:{" "}
                <span className="font-medium text-[#B54708]">
                  {formatDateTime(txn.inspectionDeadlineAt)}
                </span>
              </p>
            </div>

            {countdown && (
              <span className="text-xs font-medium text-[#B54708] px-2 py-1.5 rounded-2xl bg-[#FFFAEB] items-center">
                {countdown.label} remaining
              </span>
            )}
          </div>
        )}
      </div>

      {/* tabs */}
      <div className="flex items-center gap-5 mb-4 overflow-x-auto">
        {tabsList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold whitespace-nowrap ${
              activeTab === tab
                ? "text-brand-blue"
                : "text-brand-gray-light hover:text-brand-gray-dark"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* tab content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Product Information
              </p>
              {listing ? (
                <>
                  <ImageGallery images={productImages} />
                  <p className="text-xl font-semibold text-[#1D2939] dark:text-gray-100 mt-3">
                    {listing.title}
                  </p>
                  <p className="text-xs text-brand-gray-light mb-3">
                    {listing.category?.title ?? "—"}
                  </p>

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="profile-info-row">
                      <span className="profile-info-label">Brand</span>
                      <span className="profile-info-value">
                        {listing.brand ?? "—"}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Condition</span>
                      <span className="profile-info-value">
                        {formatLabel(listing.condition)}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Price</span>
                      <span className="profile-info-value">
                        {currency.format(listing.price)}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Location</span>
                      <span className="profile-info-value">
                        {listing.locationLabel}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Listing ID</span>
                      <button
                        onClick={() => navigate(`/listings/${listing.slug}`)}
                        className="text-brand-blue cursor-pointer"
                      >
                        {listing.slug}
                      </button>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Listing Status</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                        {formatLabel(listing.status)}
                      </span>
                    </div>
                    <div className="profile-info-row">
                      <span className="profile-info-label">Listed On</span>
                      <span className="profile-info-value">
                        {formatDate(listing.createdAt)}
                      </span>
                    </div>
                  </div>

                  <p className="profile-info-label mb-2 border-t border-brand-gray-light/30 pt-2">
                    Description
                  </p>
                  <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                    {listing.description}
                  </p>

                  {listing.hasDefect && (
                    <div className="mt-3">
                      <p className="text-xs text-brand-gray-light uppercase tracking-wide mb-1">
                        Seller's Defect Summary
                      </p>
                      <p className="text-sm text-[#F79009] dark:text-amber-400 bg-[#FFFCF5] dark:bg-amber-950 rounded-lg px-3 py-2">
                        {listing.defectDescription ??
                          "Seller flagged a defect but didn't provide a description."}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-brand-gray-light">
                  The listing for this transaction is no longer available.
                </p>
              )}
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Parties
            </p>
            {[buyer, seller].filter(Boolean).map((party) => (
              <div key={party!.id} className="flex items-center gap-2.5 mb-3">
                <img
                  src={avatarPlaceholder}
                  alt={party!.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                      {party!.name}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                      {formatLabel(party!.status)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        party!.rolePlayed === "seller"
                          ? "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950"
                          : "text-[#7F22FE] bg-[#F5F3FF] dark:text-purple-400 dark:bg-purple-950"
                      }`}
                    >
                      {formatLabel(party!.rolePlayed)}
                    </span>
                  </div>
                  <p className="text-xs text-brand-gray-light">
                    {party!.slug} · {party!.email}
                  </p>
                </div>
              </div>
            ))}
            {!buyer && !seller && (
              <p className="text-sm text-brand-gray-light">
                No party information available.
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === "Payment & Escrow" && (
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Payment Details
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Reference</span>
              <span className="profile-info-value">{txn.reference}</span>
            </div>
            {txn.paystackReference && (
              <div className="profile-info-row">
                <span className="profile-info-label">Gateway Reference</span>
                <span className="profile-info-value">
                  {txn.paystackReference}
                </span>
              </div>
            )}
            <div className="profile-info-row">
              <span className="profile-info-label">Gateway</span>
              <span className="profile-info-value">
                {formatLabel(txn.gateway)}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Payment Method</span>
              <span className="profile-info-value">
                {formatLabel(txn.paymentMethod)}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Amount Paid</span>
              <span className="profile-info-value">
                {currency.format(txn.amount)}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">
                Platform Fee ({txn.commissionPercentage}%)
              </span>
              <span className="profile-info-value">
                {currency.format(platformFee)}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Gateway Processing Fee</span>
              <span className="profile-info-value">
                {currency.format(txn.gatewayProcessingFee)}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Seller Receivable</span>
              <span className="text-sm font-semibold text-[#039855]">
                {sellerReceivable != null
                  ? currency.format(sellerReceivable)
                  : "Not yet finalized"}
              </span>
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Escrow Details
            </p>
            {txn.escrow ? (
              <>
                <div className="profile-info-row">
                  <span className="profile-info-label">Escrow Reference</span>
                  <span className="profile-info-value">{txn.escrow.slug}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Created On</span>
                  <span className="profile-info-value">
                    {formatDate(txn.escrow.createdAt)}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Status</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0F9FF] text-brand-blue dark:bg-blue-950 dark:text-blue-400">
                    {formatLabel(txn.escrow.status)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-brand-gray-light">
                No escrow has been created for this transaction yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* {activeTab === "Timeline" && (
        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Transaction Timeline
          </p>
          <p className="text-xs text-brand-gray-light mb-3">
            Ordered as returned by the API — the backend doesn't return a
            timestamp per event yet, so entries aren't individually dated.
          </p>
          <div className="relative">
            {txn.activityLog.length === 0 && (
              <p className="text-sm text-brand-gray-light">
                No activity recorded yet.
              </p>
            )}
            {txn.activityLog.map((event, i) => {
              const isPaymentEvent =
                event.event.includes("checkout") ||
                event.event.includes("payment");
              const isEscrowReleasedEvent = event.event.includes("funds_released");

              return (
                <div
                  key={event.id}
                  className="relative flex gap-3 pb-6 last:pb-0"
                >
                  {i < txn.activityLog.length - 1 && (
                    <span className="absolute left-2.25 top-6 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                  )}

                  {isPaymentEvent ? (
                    <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shrink-0 z-10">
                      <FiDollarSign className="w-3 h-3 text-white" />
                    </span>
                  ) : isEscrowReleasedEvent ? (
                    <span className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center shrink-0 z-10">
                      <FiCheck className="w-3 h-3 text-white" />
                    </span>
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-brand-blue bg-white dark:bg-gray-900 flex items-center justify-center shrink-0 z-10">
                      <span className="w-3 h-3 rounded-full bg-brand-blue" />
                    </span>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                        {event.label}
                      </p>
                      <span className="text-xs text-brand-gray-light shrink-0">
                        {event.slug}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-brand-gray-dark dark:text-gray-200">
                        {event.actor.name}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border-gray-100 dark:border-gray-800 text-brand-gray-dark dark:text-gray-300">
                        {formatLabel(event.actor.role)}
                      </span>
                    </div>
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <p className="text-xs text-brand-gray-light mt-1">
                        {describeMetadata(event.metadata)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )} */}

      {activeTab === "Communication" && (
        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Communication Log
          </p>
          <div className="flex flex-col">
            {txn.communicationLog.length === 0 && (
              <p className="text-sm text-brand-gray-light">
                No communication has been sent yet.
              </p>
            )}
            {txn.communicationLog.map((entry, i) => (
              <div
                key={i}
                className="py-3 dark:border-gray-800 rounded-md p-2 border border-gray-100 mb-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        entry.channel === "push"
                          ? "bg-[#F0F9FF] text-[#026AA2] dark:bg-blue-950 dark:text-blue-400"
                          : entry.channel === "email"
                            ? "bg-[#F4F3FF] text-[#5925DC] dark:bg-purple-950 dark:text-purple-400"
                            : "bg-[#ECFDF3] text-[#027A48] dark:bg-green-950 dark:text-green-400"
                      }`}
                    >
                      {channelLabel(entry.channel)}
                    </span>
                    <span className="text-xs text-brand-gray-light">
                      System → {formatLabel(entry.recipient)}
                    </span>
                  </div>
                  <span className="text-xs text-brand-gray-light shrink-0">
                    {formatDateTime(entry.sentAt)}
                  </span>
                </div>
                <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-200 mt-1">
                  {entry.title}
                </p>
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {entry.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Inspection" && (
        <div className="flex flex-col gap-4">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Inspection Details
            </p>
            {txn.inspectionStatus === "awaiting" ? (
              <>
                <div className="bg-[#FFFCF5] dark:bg-amber-950 rounded-lg px-3 py-3">
                  <p className="text-sm font-medium text-[#DC6803] dark:text-amber-400 flex items-center gap-1.5">
                    <FiClock className="w-4 h-4" /> Inspection Pending
                  </p>
                  <p className="text-xs text-[#F79009] dark:text-amber-400 mt-1">
                    Deadline: {formatDateTime(txn.inspectionDeadlineAt)}
                  </p>
                  {countdown && (
                    <p className="text-xs font-medium text-[#B54708] dark:text-amber-400">
                      {countdown.label} remaining
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2">
                  <span className="text-xs text-[#888888]">Reminders Sent</span>
                  <span className="text-xs font-medium text-brand-gray-dark">
                    {txn.inspectionReminderCount ?? 0}
                  </span>
                </div>
                {txn.inspectionExtended && (
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#888888]">
                      Extension Granted
                    </span>
                    <span className="text-xs font-medium text-brand-gray-dark">
                      {txn.inspectionExtendedBy
                        ? `${txn.inspectionExtendedBy} day(s), `
                        : ""}
                      ends {formatDateTime(txn.inspectionExtensionEndDate)}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 mb-3 ${txn.inspectionStatus === "failed" ? "bg-red-50 dark:bg-red-950" : "bg-green-50 dark:bg-green-950"}`}
                >
                  <FiCheckCircle
                    className={`w-4 h-4 shrink-0 ${txn.inspectionStatus === "failed" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                  />
                  <p
                    className={`text-sm font-medium ${txn.inspectionStatus === "failed" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                  >
                    {txn.inspectionStatus === "failed"
                      ? "Inspection Failed"
                      : "Inspection Completed Successfully"}
                  </p>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Inspection Deadline</span>
                  <span className="profile-info-value">
                    {formatDateTime(txn.inspectionDeadlineAt)}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Outcome</span>
                  <span
                    className={`text-sm font-medium ${txn.inspectionStatus === "failed" ? "text-red-500" : "text-green-600"}`}
                  >
                    {formatLabel(txn.inspectionOutcome)}
                  </span>
                </div>
              </>
            )}
          </div>

          {txn.status === "disputed" && (
            <>
              <p className="mx-4 text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Dispute Info
              </p>
              <div className="detail-section-card border-[#F04438]/20">
                {txn.disputeInfo ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          realStatusPillClass[txn.disputeStatus ?? txn.disputeInfo.status] ??
                          statusFallback
                        }`}
                      >
                        {formatLabel(txn.disputeStatus ?? txn.disputeInfo.status)}
                      </span>
                      <span className="text-xs text-brand-gray-light">
                        {txn.disputeInfo.slug} · Raised{" "}
                        {formatDateTime(txn.disputeInfo.createdAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="profile-info-label mb-1.5">
                          Buyer's Statement
                        </p>
                        <p className="text-sm text-brand-gray-dark dark:text-gray-300 bg-[#FAFAFA] dark:bg-gray-900 rounded-lg p-3">
                          {txn.disputeInfo.buyerStatement || "No statement provided."}
                        </p>
                      </div>
                      <div>
                        <p className="profile-info-label mb-1.5">
                          Seller's Statement
                        </p>
                        <p className="text-sm text-brand-gray-dark dark:text-gray-300 bg-[#FAFAFA] dark:bg-gray-900 rounded-lg p-3">
                          {txn.disputeInfo.sellerStatement || "No statement provided."}
                        </p>
                      </div>
                    </div>

                    {(txn.disputeInfo.evidenceImages.length > 0 ||
                      txn.disputeInfo.evidenceVideo) && (
                      <div>
                        <p className="profile-info-label mb-2">Evidence</p>
                        <ImageGallery
                          images={[
                            ...txn.disputeInfo.evidenceImages.map((img) => ({
                              id: img.publicId,
                              url: img.secureUrl || img.url,
                            })),
                            ...(txn.disputeInfo.evidenceVideo
                              ? [
                                  {
                                    id: txn.disputeInfo.evidenceVideo.publicId,
                                    url:
                                      txn.disputeInfo.evidenceVideo.secureUrl ||
                                      txn.disputeInfo.evidenceVideo.url,
                                    isVideo: true,
                                  },
                                ]
                              : []),
                          ]}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-brand-gray-light">
                    Dispute details (reason, category, buyer/seller statements,
                    evidence) aren't available for this transaction yet.
                  </p>
                )}
              </div>
            </>
          )}

          {/* Refund info — real refundInfo when the backend returns it;
              falls back to activityLog metadata for older refunded
              transactions where refundInfo still comes back null. */}
          {txn.status === "refunded" && (
            <>
              <p className="mx-4 text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Refund Info
              </p>
              <div className="detail-section-card border-[#3B82F6]/20">
                <div className="rounded-lg mb-3">
                  <div className="flex items-center gap-2 bg-[#FAFAFF] rounded-md p-4">
                    <FiCheckCircle className="w-4 h-4 text-[#7F22FE] dark:text-purple-400 shrink-0" />
                    <p className="text-sm font-medium text-[#7F22FE] dark:text-purple-400">
                      {refundSummary.status
                        ? formatLabel(refundSummary.status)
                        : "Refund Processed"}
                    </p>
                  </div>
                </div>
                {refundSummary.refundReference && (
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Reference</span>
                    <span className="profile-info-value">
                      {refundSummary.refundReference}
                    </span>
                  </div>
                )}
                <div className="profile-info-row">
                  <span className="profile-info-label">Refund Amount</span>
                  <span className="profile-info-value">
                    {refundSummary.refundAmount != null
                      ? currency.format(refundSummary.refundAmount)
                      : "—"}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Commission Retained</span>
                  <span className="profile-info-value">
                    {refundSummary.commissionRetained != null
                      ? currency.format(refundSummary.commissionRetained)
                      : "—"}
                  </span>
                </div>
                {refundSummary.reason && (
                  <div className="profile-info-row">
                    <span className="profile-info-label">Reason</span>
                    <span className="profile-info-value">
                      {refundSummary.reason}
                    </span>
                  </div>
                )}
                <div className="profile-info-row">
                  <span className="profile-info-label">Refunded On</span>
                  <span className="profile-info-value">
                    {refundSummary.refundedAt
                      ? formatDateTime(refundSummary.refundedAt)
                      : "—"}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Escrow Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                    {txn.escrow ? formatLabel(txn.escrow.status) : "—"}
                  </span>
                </div>
                {(refundSummary.payoutAccountNumber ||
                  refundSummary.payoutBankCode) && (
                  <div className="profile-info-row">
                    <span className="profile-info-label">Payout Account</span>
                    <span className="profile-info-value">
                      {refundSummary.payoutAccountNumber ?? "—"}
                      {refundSummary.payoutBankCode
                        ? ` (Bank ${refundSummary.payoutBankCode})`
                        : ""}
                    </span>
                  </div>
                )}
                {!refundSummary.refundReference && (
                  <p className="text-xs text-brand-gray-light mt-3">
                    Full refund metadata isn't available for this
                    transaction — the backend's{" "}
                    <span className="font-mono text-xs">refundInfo</span>{" "}
                    came back <span className="font-mono text-xs">null</span>,
                    so these figures are derived from the activity log
                    instead.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "Activity Log" && (
        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Activity Log
          </p>
          <div className="flex flex-col">
            {txn.activityLog.length === 0 && (
              <p className="text-sm text-brand-gray-light">
                No activity recorded yet.
              </p>
            )}
            {txn.activityLog.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
              >
                <div>
                  <p className="text-sm text-brand-gray-dark dark:text-gray-200">
                    {entry.label}
                  </p>
                  <p className="text-xs text-brand-gray-light">
                    {entry.actor.name} · {formatLabel(entry.actor.role)}
                  </p>
                </div>
                <span className="text-xs text-brand-gray-light shrink-0">
                  {entry.slug}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Notes" && (
        <NotesTab
          notes={txn.transactionNotes}
          currentAdminId={me?.id}
          onAddNote={handleAddNote}
          isAdding={isAddingNote}
          onUpdateNote={handleUpdateNote}
          isUpdating={isUpdatingNote}
          onDeleteNote={handleDeleteNote}
        />
      )}

      {activeTab === "Location" && listing && (
        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Location Info
          </p>
          <div className="mb-4">
            <p className="text-xs text-brand-gray-light">Meeting Area</p>
            <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
              {listing.locationLabel}
            </p>
          </div>

          <ListingLocationMap
            lat={listing.location?.coordinates[1] ?? 0}
            lng={listing.location?.coordinates[0] ?? 0}
            label={listing.locationLabel}
          />
          <p className="text-sm text-brand-gray-dark dark:text-gray-200 mt-3">
            {listing.address}
          </p>
          <a
            href={`https://www.google.com/maps?q=${listing.location?.coordinates[1] ?? 0},${listing.location?.coordinates[0] ?? 0}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg hover:bg-[#93C5FD] mt-3"
          >
            Open in Google Maps
          </a>
        </div>
      )}

      {activeTab === "Location" && !listing && (
        <NotFoundState
          icon={<FiFileText className="w-5 h-5" />}
          message="No location information available — the listing for this transaction is no longer available."
        />
      )}

      {reminderModalOpen && (
        <SendReminderModal
          buyerName={buyer?.name ?? "the buyer"}
          lastNotified={
            txn.inspectionReminderCount
              ? `${txn.inspectionReminderCount} reminder(s) sent so far`
              : "No reminders sent yet"
          }
          onClose={() => setReminderModalOpen(false)}
          onSend={handleSendReminder}
          isSending={isSendingReminder}
        />
      )}

      {receiptModalOpen && (
        <ReceiptModal
          receipt={buildReceiptFromRecord(txn)}
          onClose={() => setReceiptModalOpen(false)}
        />
      )}

      {refundModalOpen && txn.status === "refunded" && (
        <RefundDetailsModal
          refund={refundSummary}
          onClose={() => setRefundModalOpen(false)}
        />
      )}
    </div>
  );
}

function NotesTab({
  notes,
  currentAdminId,
  onAddNote,
  isAdding,
  onUpdateNote,
  isUpdating,
  onDeleteNote,
}: {
  notes: TransactionNoteRecord[];
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

  const startEditing = (note: TransactionNoteRecord) => {
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
