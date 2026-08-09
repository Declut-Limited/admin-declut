import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPrinter,
  FiClock,
  FiPlus,
  FiTrash2,
  FiFileText,
  FiBell,
  FiCheckCircle,
  FiAlertTriangle,
  FiCheck,
  FiDollarSign,
  FiEdit3,
} from "react-icons/fi";
import { HiClock, HiOutlineReceiptRefund } from "react-icons/hi2";
import ImageGallery from "@/components/generic/ImageGallery";
import ListingLocationMap from "@/components/generic/ListingLocationMap";
import Button from "@/components/generic/Button";
import SendReminderModal from "./SendReminderModal";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { TransactionDetail } from "../types";
import ReceiptModal from "./ReceiptModal";
import RefundDetailsModal from "./RefundDetailsModal";
import NotFoundState from "@/components/generic/NotFoundState";
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
import { LuCircleDollarSign, LuNotepadText } from "react-icons/lu";
import { RiLockPasswordFill } from "react-icons/ri";
import layers from "@/assets/icons/layer-black.svg";
import { IoDocumentTextOutline } from "react-icons/io5";
import { showToast } from "@/lib/utils/toast";
import { BsCheckCircleFill } from "react-icons/bs";
import listingMain from "@/assets/listing-main.jpg";

const statusPillClass: Record<TransactionDetail["status"], string> = {
  Active: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Completed: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  Refunded: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  Disputed: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
};

const statusLabel: Record<TransactionDetail["status"], string> = {
  Active: "Awaiting Inspection",
  Completed: "Completed",
  Refunded: "Refunded",
  Disputed: "Disputed",
};

const tabsList = [
  "Overview",
  "Payment & Escrow",
  "Timeline",
  "Communication",
  "Inspection",
  "Activity Log",
  "Notes",
  "Location",
];

const baseTransaction: TransactionDetail = {
  code: "TXN-2026-08753",
  status: "Active",
  createdDate: "Jul 8, 2025, 09:14 AM",
  transactionAmount: "₦57,000",
  escrowAmount: "₦57,000",
  duration: "2d 6h 37m",
  currentStage: "Inspection",
  stages: [
    { label: "Payment Secured", state: "completed" },
    { label: "Seller Notified", state: "completed" },
    { label: "Inspection", state: "current" },
    { label: "Buyer Decision", state: "pending" },
    { label: "Resolution", state: "pending" },
  ],
  deadline: {
    label: "Inspection Deadline",
    date: "July 12, 2026, 09:14 AM",
    remaining: "13:42:17 remaining",
  },
  product: {
    images: [
      { id: "1", url: listingMain },
      { id: "2", url: "https://placehold.co/600x400/222/fff?text=2" },
      {
        id: "3",
        url: "https://placehold.co/600x400/333/fff?text=3",
        isVideo: true,
      },
    ],
    name: "Apple MacBook Pro 14-inch M3 Pro",
    category: "Laptops & Computers",
    brand: "Apple",
    condition: "Used - Excellent",
    price: "₦57,000",
    location: "Victoria Island, Lagos",
    listingId: "LST-2026-08753",
    listingStatus: "Sold",
    listedOn: "Mar 14, 2026",
    description:
      "MacBook Pro 14-inch with M3 Pro chip, 18GB RAM, 512GB SSD. Purchased January 2024, used for light professional work. No scratches, no dents. Battery health at 97%. Original box and charger included.",
    defectSummary:
      "Minor keyboard key rattle on 'R' key — does not affect functionality.",
  },
  parties: {
    buyer: {
      name: "Kunle Abiola",
      id: "USR-001",
      email: "kunle.abiola@mail.com",
      status: "Active",
      role: "Buyer",
    },
    seller: {
      name: "Jenny Segore",
      id: "USR-005",
      email: "jenny.segore@mail.com",
      status: "Active",
      role: "Seller",
    },
  },
  payment: {
    reference: "PAY-REF-2026-001923",
    gateway: "Paystack",
    method: "Bank Transfer",
    amountPaid: "₦485,500",
    platformFee: "₦14,500",
    processingFee: "₦4,200",
    sellerReceivable: "₦57,000",
  },
  escrowDetail: {
    reference: "ESC-2026-001923",
    createdOn: "July 8, 2025",
    status: "Held",
  },
  timeline: [
    {
      id: "1",
      label: "Payment secured by buyer",
      actor: "Adaeze Okonkwo",
      actorType: "App",
      detail: "₦485,500 received via bank transfer",
      channels: [],
      date: "Jul 8, 09:14",
      completed: true,
    },
    {
      id: "2",
      label: "Escrow created",
      actor: "System",
      actorType: "Automatic",
      detail: "Funds held in escrow ESC-2026-001923",
      channels: [],
      date: "Jul 8, 09:15",
      completed: true,
    },
    {
      id: "3",
      label: "Seller notified",
      actor: "System",
      actorType: "Automatic",
      detail: "Seller has been asked to share contact details",
      channels: ["Push", "Email"],
      date: "Jul 8, 09:16",
      completed: true,
    },
    {
      id: "4",
      label: "Seller details shared with buyer",
      actor: "Emeka Nwosu",
      actorType: "Seller",
      detail: "Phone and meeting location shared",
      channels: [],
      date: "Jul 8, 11:00",
      completed: true,
    },
    {
      id: "5",
      label: "Inspection reminder sent",
      actor: "System",
      actorType: "Automatic",
      detail: "36-hour reminder via email",
      channels: [],
      date: "Jul 9, 10:00",
      completed: true,
    },
    {
      id: "6",
      label: "Second inspection reminder sent",
      actor: "System",
      actorType: "Automatic",
      detail: "18-hour top reminder",
      channels: [],
      date: "Jul 10, 09:00",
      completed: false,
    },
    {
      id: "7",
      label: "Item inspected by buyer",
      actor: "Adaeze Okonkwo",
      actorType: "App",
      detail: "Physical inspection completed at Victoria Island",
      channels: [],
      date: "Jul 11, 14:15",
      completed: false,
    },
    {
      id: "8",
      label: "Buyer confirmed item",
      actor: "Adaeze Okonkwo",
      actorType: "App",
      detail: "Item accepted, no dispute",
      channels: [],
      date: "Jul 11, 15:52",
      completed: false,
    },
    {
      id: "9",
      label: "Escrow released to seller",
      actor: "System",
      actorType: "Automatic",
      detail: "₦465,600 transferred to seller account",
      channels: [],
      date: "Jul 11, 15:53",
      completed: false,
    },
  ],
  communication: [
    {
      id: "1",
      channel: "Push",
      direction: "System → Buyer",
      message:
        "Your payment has been secured. The seller has been notified to share their contact details.",
      date: "Jul 8, 09:20",
    },
    {
      id: "2",
      channel: "Email",
      direction: "System → Seller",
      message:
        "You have a new buyer! Share your contact details to proceed with the inspection.",
      date: "Jul 8, 09:20",
    },
    {
      id: "3",
      channel: "SMS",
      direction: "System → Buyer",
      message:
        "Seller contact shared. Please schedule your inspection within 48 hours.",
      date: "Jul 8, 11:45",
    },
    {
      id: "4",
      channel: "Push",
      direction: "System → Buyer",
      message: "Reminder: You have 24 hours left to inspect the MacBook Pro.",
      date: "Jul 9, 10:00",
    },
    {
      id: "5",
      channel: "Email",
      direction: "System → Both",
      message:
        "Transaction TXN-2025-08934I completed. Funds have been released to the seller.",
      date: "Jul 11, 15:55",
    },
  ],
  inspection: {
    status: "Pending",
    deadline: "Jul 12, 2025, 09:14 AM",
    remaining: "13:42:17 remaining",
    reminderSent: "2 of 3",
  },
  activityLog: [
    {
      id: "1",
      label: "Viewed transaction details",
      actor: "Admin Fatima O.",
      actorType: "Operations Admin",
      date: "Jul 12, 10:42 AM",
    },
    {
      id: "2",
      label: "Escrow released — ₦465,600 transferred to Emeka Nwosu",
      actor: "System",
      actorType: "Automated",
      date: "Jul 11, 3:53 PM",
    },
    {
      id: "3",
      label: "Confirmed item receipt and released payment",
      actor: "Adaeze Okonkwo",
      actorType: "Buyer",
      date: "Jul 11, 3:52 PM",
    },
    {
      id: "4",
      label: "Marked inspection as complete",
      actor: "Adaeze Okonkwo",
      actorType: "Buyer",
      date: "Jul 11, 2:15 PM",
    },
    {
      id: "5",
      label: "Final 24h inspection reminder dispatched (Push + Email)",
      actor: "System",
      actorType: "Automated",
      date: "Jul 10, 9:00 AM",
    },
    {
      id: "6",
      label: "48h inspection reminder dispatched (Push + SMS)",
      actor: "System",
      actorType: "Automated",
      date: "Jul 9, 10:00 AM",
    },
    {
      id: "7",
      label: "Shared contact details with buyer",
      actor: "Emeka Nwosu",
      actorType: "Seller",
      date: "Jul 8, 11:42 AM",
    },
    {
      id: "8",
      label: "Secured item — payment of ₦485,000 submitted",
      actor: "Adaeze Okonkwo",
      actorType: "Buyer",
      date: "Jul 8, 09:14 AM",
    },
  ],
  notes: [
    {
      id: "1",
      author: "Admin Chidi E.",
      note: "Buyer called support to confirm inspection process. Walked through the app flow. No issues.",
      date: "Jul 10, 2025 · 2:30 PM",
    },
    {
      id: "2",
      author: "Admin Fatima O.",
      note: "Seller confirmed item is ready for pickup at Lekki Phase 1. Buyer acknowledged.",
      date: "Jul 11, 2025 · 9:15 AM",
    },
  ],
  location: {
    buyerLocation: "Lagos, Lagos State",
    sellerLocation: "Lekki Phase 1, Lagos",
    approxDistance: "~12 km",
    meetingArea: "Victoria Island, Lagos",
    address: "89 Allen Avenue, Abeokuta, Nigeria",
    lat: 6.5244,
    lng: 3.3792,
  },
};

// placeholder
const mockTransactions: Record<string, TransactionDetail> = {
  "1": baseTransaction,
  "2": {
    ...baseTransaction,
    status: "Disputed",
    currentStage: "Buyer Decision",
    stages: [
      { label: "Payment Secured", state: "completed" },
      { label: "Seller Notified", state: "completed" },
      { label: "Inspection", state: "completed" },
      { label: "Buyer Decision", state: "current" },
      { label: "Under Dispute", state: "pending" },
    ],
    slaRemaining: "47h 00m",
    inspection: {
      status: "Disputed",
      inspectionDate: "Jul 11, 2025, 2:15 PM",
      buyerConfirmation: "Jul 11, 2025, 3:52 PM",
      outcome: "Disputed",
      notes:
        "Item matched listing description. Minor keyboard rattle on 'R' key noted but accepted by buyer. No defects disputed. Handover confirmed at Victoria Island.",
    },
    disputeInfo: {
      disputeId: "DSP-2026-8764",
      reason: "Item significantly different from listing",
      category: "Item Condition",
      opened: "Jul 11, 2025, 3:52 PM",
      status: "Under Review",
      buyerStatement:
        "The MacBook Pro has a cracked corner that was not disclosed in the listing. The photos showed a pristine device but the unit I received has visible damage on the bottom-left corner. I want a full refund.",
      sellerStatement:
        "The damage was mentioned in the product description under defects. The buyer inspected the item in person before confirming. I have timestamped photos taken at the point of handover.",
      evidence: [
        "buyer_photo.jpg",
        "seller_handover.jpg",
        "listing_screenshot.png",
      ],
    },
  },
  "3": {
    ...baseTransaction,
    status: "Refunded",
    currentStage: "Refund Processed",
    stages: [
      { label: "Payment Secured", state: "completed" },
      { label: "Seller Notified", state: "completed" },
      { label: "Inspection", state: "completed" },
      { label: "Buyer Decision", state: "completed" },
      { label: "Refund Processed", state: "completed" },
    ],
    inspection: {
      status: "Disputed",
      inspectionDate: "Jul 11, 2025, 2:15 PM",
      buyerConfirmation: "Jul 11, 2025, 3:52 PM",
      outcome: "Disputed",
      notes:
        "Item matched listing description. Minor keyboard rattle on 'R' key noted but accepted by buyer. No defects disputed. Handover confirmed at Victoria Island.",
    },
    refundInfo: {
      amount: "₦485,000",
      reason: "Item not as described",
      status: "Processed",
      approvedBy: "Admin Fatima O.",
      refundDate: "Jul 12, 2025",
      settlementRef: "SET-2025-08934I",
      resolutionTime: "18h 22m",
      refundId: "RFD-2025-001023",
    },
  },
};

function StageStepper({ stages }: { stages: TransactionDetail["stages"] }) {
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
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const txn = transactionId ? mockTransactions[transactionId] : undefined;
  const [activeTab, setActiveTab] = useState("Overview");
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  if (!txn) {
    return (
      <NotFoundState
        icon={<FiFileText className="w-5 h-5" />}
        message="Transaction not found."
      />
    );
  }

  const handleSendReminder = () => {
    setReminderModalOpen(false);
    showToast.success("Reminder Sent successfully!", {
      description: "A reminder has been sent to the user to make payment.",
    });
  };

  const moreActions: RowAction[] = [
    {
      label: "View Details",
      icon: <FiEye className="w-4 h-4" />,
      onClick: () => {},
    },
    {
      label: "Download Receipt",
      icon: <FiDownloadIcon className="w-4 h-4" />,
      onClick: () => setReceiptModalOpen(true),
    },
    {
      label: "View Item",
      icon: <FiEye className="w-4 h-4" />,
      onClick: () => navigate(`/listings/${txn.product.listingId}`),
    },
    {
      label: "View Buyer Profile",
      icon: <FiUser className="w-4 h-4" />,
      onClick: () => navigate(`/users/${txn.parties.buyer.id}`),
    },
    {
      label: "View Seller Profile",
      icon: <FiUser className="w-4 h-4" />,
      onClick: () => navigate(`/users/${txn.parties.seller.id}`),
    },
    {
      label: "Contact Buyer",
      icon: <FiMail className="w-4 h-4" />,
      onClick: () => {},
    },
    {
      label: "Contact Seller",
      icon: <FiMail className="w-4 h-4" />,
      onClick: () => {},
    },
  ];

  if (txn.status !== "Refunded" && txn.status !== "Completed") {
    moreActions.push({
      label: "Refund",
      icon: <HiOutlineReceiptRefund className="w-4 h-4" />,
      variant: "danger",
      onClick: () =>
        showToast.error("Refund initiated", {
          description:
            "The refund process has been started for this transaction.",
        }),
    });
  }

  return (
    <div>
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
              {txn.code}
            </h1>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[txn.status]}`}
            >
              {statusLabel[txn.status]}
            </span>
          </div>
          <span className="text-xs text-brand-gray-light mt-0.5">
            Created
            <p className="text-brand-gray-dark">{txn.createdDate}</p>
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
            triggerClassName="w-9 h-9 rounded-full dark:text-white border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800"
          />
        </div>
      </div>

      {/* status banner TODO:verify if it matches from backend */}
      {txn.status === "Active" && txn.deadline && (
        <div className="flex items-center justify-between bg-[#FFFAEB] dark:bg-amber-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#FEF3C6] dark:bg-amber-950 rounded-md flex items-center justify-center p-2 shrink-0">
              <FiClock className="w-4 h-4 text-[#E17100] dark:text-amber-400" />
            </span>

            <div>
              <p className="text-sm font-medium text-[#7B3306] dark:text-amber-300">
                Waiting for buyer to inspect this item.
              </p>
              <p className="text-xs text-[#BB4D00] dark:text-amber-400">
                The buyer has 18 hours remaining before the inspection window
                closes.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-[#FEC84B] dark:border-amber-700 bg-amber-100 dark:bg-amber-900 text-[#BB4D00] dark:text-amber-300">
              {txn.deadline.remaining.split(" ")[0]} remaining
            </span>
            <Button
              textColor="#111827 dark:text-white"
              leftIcon={<FiBell className="w-4 h-4" />}
              onClick={() => setReminderModalOpen(true)}
            >
              Send Reminder
            </Button>
          </div>
        </div>
      )}

      {txn.status === "Completed" && (
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
                Escrow was released to the seller on{" "}
                {txn.timeline.find(
                  (e) => e.label === "Escrow released to seller",
                )?.date ?? "—"}
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

      {txn.status === "Disputed" && (
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
                A dispute was opened on {txn.disputeInfo?.opened ?? "—"}. SLA-
                {txn.slaRemaining ?? "—"} remaining before escalation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {txn.slaRemaining && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-900 text-[#C10007] dark:text-red-400 border border-[#FECDCA] dark:border-red-800">
                {txn.slaRemaining} SLA
              </span>
            )}
            <Button
              bgColor="bg-transparent"
              textColor="text-[#F04438]"
              borderColor="border-[#FECDCA] dark:border-red-900"
              leftIcon={<FiEye className="w-4 h-4" />}
            >
              Review Evidence
            </Button>
          </div>
        </div>
      )}

      {txn.status === "Refunded" && (
        <div className="flex items-center justify-between bg-[#F5F3FF] dark:bg-purple-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#EDE9FE] dark:bg-purple-900 rounded-md flex items-center justify-center p-2 shrink-0">
              <FaRotate className="w-4 h-4 text-[#7F22FE] dark:text-purple-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#4D179A] dark:text-purple-300">
                Funds have been successfully returned to the buyer.
              </p>
              <p className="text-xs text-[#7008E7] dark:text-purple-400">
                Refund of {txn.refundInfo?.amount ?? "—"} was processed on{" "}
                {txn.refundInfo?.refundDate ?? "—"}. Resolution time:{" "}
                {txn.refundInfo?.resolutionTime ?? "—"}.
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

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="detail-stat-card">
          <p className="detail-stat-value">{txn.transactionAmount}</p>
          <p className="detail-stat-label">
            <LuCircleDollarSign className="w-3.5 h-3.5" /> Transaction Amount
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">{txn.escrowAmount}</p>
          <p className="detail-stat-label">
            <RiLockPasswordFill className="w-3.5 h-3.5" /> Escrow Amount
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">{txn.duration}</p>
          <p className="detail-stat-label">
            <HiClock className="w-3.5 h-3.5" /> Transaction Duration
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">{txn.currentStage}</p>
          <p className="detail-stat-label">
            <img src={layers} className="w-4 h-4" /> Current Stage
          </p>
        </div>
      </div>

      {/* stepper */}
      <div className="detail-section-card border-none mb-4">
        <StageStepper stages={txn.stages} />
        {txn.deadline && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <FiClock className="w-4 h-4 text-[#F79009]" />
              <p className="text-xs text-brand-gray-light">
                Inspection Deadline:{" "}
                <span className="font-medium text-[#B54708]">
                  {txn.deadline.date}
                </span>
              </p>
            </div>

            <span className="text-xs font-medium text-[#B54708] px-2 py-1.5 rounded-2xl bg-[#FFFAEB] items-center">
              {txn.deadline.remaining}
            </span>
          </div>
        )}
      </div>

      {/* tabs */}
      <div className="flex items-center gap-5 mb-4 overflow-x-auto">
        {tabsList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium whitespace-nowrap ${
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
              <ImageGallery images={txn.product.images} />
              <p className="text-xl font-semibold text-[#1D2939] dark:text-gray-100 mt-3">
                {txn.product.name}
              </p>
              <p className="text-xs text-brand-gray-light mb-3">
                {txn.product.category}
              </p>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="profile-info-row">
                  <span className="profile-info-label">Brand</span>
                  <span className="profile-info-value">
                    {txn.product.brand}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Condition</span>
                  <span className="profile-info-value">
                    {txn.product.condition}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Price</span>
                  <span className="profile-info-value">
                    {txn.product.price}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Location</span>
                  <span className="profile-info-value">
                    {txn.product.location}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Listing ID</span>
                  <a href="#" className="text-brand-blue">
                    {txn.product.listingId}
                  </a>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Listing Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                    {txn.product.listingStatus}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Listed On</span>
                  <span className="profile-info-value">
                    {txn.product.listedOn}
                  </span>
                </div>
              </div>

              <p className="profile-info-label mb-2 border-t border-brand-gray-light/30 pt-2">
                Description
              </p>
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                {txn.product.description}
              </p>

              {txn.product.defectSummary && (
                <div className="mt-3">
                  <p className="text-xs text-brand-gray-light uppercase tracking-wide mb-1">
                    Seller's Defect Summary
                  </p>
                  <p className="text-sm text-[#F79009] dark:text-amber-400 bg-[#FFFCF5] dark:bg-amber-950 rounded-lg px-3 py-2">
                    {txn.product.defectSummary}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Parties
            </p>
            {[txn.parties.buyer, txn.parties.seller].map((party) => (
              <div key={party.id} className="flex items-center gap-2.5 mb-3">
                <img
                  src={party.avatarUrl || avatarPlaceholder}
                  alt={party.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                      {party.name}
                    </p>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                      {party.status}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        party.role === "Seller"
                          ? "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950"
                          : "text-[#7F22FE] bg-[#F5F3FF] dark:text-purple-400 dark:bg-purple-950"
                      }`}
                    >
                      {party.role}
                    </span>
                  </div>
                  <p className="text-xs text-brand-gray-light">
                    {party.id} · {party.email}
                  </p>
                </div>
              </div>
            ))}
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
              <span className="profile-info-label">Payment Reference</span>
              <a href="#" className="text-brand-blue">
                {txn.payment.reference}
              </a>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Gateway</span>
              <span className="profile-info-value">{txn.payment.gateway}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Payment Method</span>
              <span className="profile-info-value">{txn.payment.method}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Amount Paid</span>
              <span className="profile-info-value">
                {txn.payment.amountPaid}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Platform Fee (8%)</span>
              <span className="profile-info-value">
                {txn.payment.platformFee}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Processing Fee (1%)</span>
              <span className="profile-info-value">
                {txn.payment.processingFee}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Seller Receivable</span>
              <span className="text-sm font-semibold text-[#039855]">
                {txn.payment.sellerReceivable}
              </span>
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Escrow Details
            </p>
            <div className="profile-info-row">
              <span className="profile-info-label">Escrow Reference</span>
              <a href="#" className="text-brand-blue ">
                {txn.escrowDetail.reference}
              </a>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Created On</span>
              <span className="profile-info-value">
                {txn.escrowDetail.createdOn}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Status</span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F0F9FF] text-brand-blue dark:bg-blue-950 dark:text-blue-400">
                {txn.escrowDetail.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Timeline" && (
        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Transaction Timeline
          </p>
          <div className="relative">
            {txn.timeline.map((event, i) => {
              const isPaymentEvent = event.label
                .toLowerCase()
                .includes("payment secured");
              const isEscrowReleasedEvent = event.label
                .toLowerCase()
                .includes("escrow released");

              return (
                <div
                  key={event.id}
                  className="relative flex gap-3 pb-6 last:pb-0"
                >
                  {i < txn.timeline.length - 1 && (
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
                        {event.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-brand-gray-dark dark:text-gray-200">
                        {event.actor}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border-gray-100 dark:border-gray-800 text-brand-gray-dark dark:text-gray-300">
                        {event.channels && event.channels.length > 0
                          ? event.channels.join(" + ")
                          : event.actorType}
                      </span>
                    </div>
                    <p className="text-xs text-brand-gray-light mt-1">
                      {event.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "Communication" && (
        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Communication Log
          </p>
          <div className="flex flex-col">
            {txn.communication.map((entry) => (
              <div
                key={entry.id}
                className="py-3 dark:border-gray-800 rounded-md p-2 border border-gray-100 mb-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                        entry.channel === "Push"
                          ? "bg-[#F0F9FF] text-[#026AA2] dark:bg-blue-950 dark:text-blue-400"
                          : entry.channel === "Email"
                            ? "bg-[#F4F3FF] text-[#5925DC] dark:bg-purple-950 dark:text-purple-400"
                            : "bg-[#ECFDF3] text-[#027A48] dark:bg-green-950 dark:text-green-400"
                      }`}
                    >
                      {entry.channel}
                    </span>
                    <span className="text-xs text-brand-gray-light">
                      {entry.direction}
                    </span>
                  </div>
                  <span className="text-xs text-brand-gray-light shrink-0">
                    {entry.date}
                  </span>
                </div>
                <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-1">
                  {entry.message}
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
            {txn.inspection.status === "Pending" ? (
              <>
                {" "}
                <div className="bg-[#FFFCF5] dark:bg-amber-950 rounded-lg px-3 py-3">
                  <p className="text-sm font-medium text-[#DC6803] dark:text-amber-400 flex items-center gap-1.5">
                    <FiClock className="w-4 h-4" /> Inspection Pending
                  </p>
                  <p className="text-xs text-[#F79009] dark:text-amber-400 mt-1">
                    Deadline: {txn.inspection.deadline}
                  </p>
                  <p className="text-xs font-medium text-[#B54708] dark:text-amber-400">
                    {txn.inspection.remaining}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2">
                  <span className="text-xs text-[#888888]">Reminder Sent</span>
                  <span className="text-xs font-medium text-brand-gray-dark">
                    {txn.inspection.reminderSent}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 mb-3 ${txn.inspection.status === "Disputed" ? "bg-red-50 dark:bg-red-950" : "bg-green-50 dark:bg-green-950"}`}
                >
                  <FiCheckCircle
                    className={`w-4 h-4 shrink-0 ${txn.inspection.status === "Disputed" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                  />
                  <p
                    className={`text-sm font-medium ${txn.inspection.status === "Disputed" ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                  >
                    Inspection Completed Successfully
                  </p>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Inspection Date</span>
                  <span className="profile-info-value">
                    {txn.inspection.inspectionDate}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Buyer Confirmation</span>
                  <span className="profile-info-value">
                    {txn.inspection.buyerConfirmation}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Outcome</span>
                  <span
                    className={`text-sm font-medium ${txn.inspection.outcome === "Disputed" ? "text-red-500" : "text-green-600"}`}
                  >
                    {txn.inspection.outcome}
                  </span>
                </div>
                <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mt-3 mb-1 border-t border-brand-gray-light/20 pt-2">
                  Inspection Notes
                </p>
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {txn.inspection.notes}
                </p>
              </>
            )}
          </div>

          {/* Dispute info; only when disputeInfo present */}
          {txn.disputeInfo && (
            <>
              <p className="mx-4 text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Dispute Info
              </p>
              <div className="detail-section-card border-[#F04438]/20">
                <div className="profile-info-row">
                  <span className="profile-info-label">Dispute ID</span>
                  <a href="#" className="text-brand-blue ">
                    {txn.disputeInfo.disputeId}
                  </a>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Reason</span>
                  <span className="profile-info-value">
                    {txn.disputeInfo.reason}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Category</span>
                  <span className="profile-info-value">
                    {txn.disputeInfo.category}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Opened</span>
                  <span className="profile-info-value">
                    {txn.disputeInfo.opened}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400">
                    {txn.disputeInfo.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mt-4 mb-1">
                  Buyer Statement
                </p>
                <p className="text-sm text-brand-gray-dark dark:text-gray-300 bg-[#EFF6FF] dark:bg-blue-950 rounded-lg px-3 py-2">
                  {txn.disputeInfo.buyerStatement}
                </p>

                <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mt-4 mb-1">
                  Seller Statement
                </p>
                <p className="text-sm text-brand-gray-dark dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2">
                  {txn.disputeInfo.sellerStatement}
                </p>

                <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mt-4 mb-2">
                  Evidence Submitted
                </p>
                <div className="flex flex-wrap gap-2">
                  {txn.disputeInfo.evidence.map((file) => (
                    <a
                      key={file}
                      href="#"
                      className="flex items-center gap-1.5 text-xs text-brand-gray-dark border border-brand-gray-light/50 dark:border-blue-900 rounded-md px-2 py-1 "
                    >
                      <IoDocumentTextOutline className="w-3 h-3" /> {file}
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Refund info; only when refundInfo present */}
          {txn.refundInfo && (
            <>
              <p className="mx-4 text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Refund Info
              </p>
              <div className="detail-section-card border-[#3B82F6]/20">
                <div className="rounded-lg mb-3">
                  <div className="flex items-center gap-2 bg-[#FAFAFF] rounded-md p-4">
                    <FiCheckCircle className="w-4 h-4 text-[#7F22FE] dark:text-purple-400 shrink-0" />
                    <p className="text-sm font-medium text-[#7F22FE] dark:text-purple-400">
                      Refund Successfully Processed
                    </p>
                  </div>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Refund Amount</span>
                  <span className="profile-info-value">
                    {txn.refundInfo.amount}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Reason</span>
                  <span className="profile-info-value">
                    {txn.refundInfo.reason}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                    {txn.refundInfo.status}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Approved By</span>
                  <span className="profile-info-value">
                    {txn.refundInfo.approvedBy}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Refund Date</span>
                  <span className="profile-info-value">
                    {txn.refundInfo.refundDate}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Settlement Ref</span>
                  <a href="#" className="text-brand-blue ">
                    {txn.refundInfo.settlementRef}
                  </a>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Resolution Time</span>
                  <span className="profile-info-value">
                    {txn.refundInfo.resolutionTime}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Refund ID</span>
                  <a href="#" className="text-brand-blue ">
                    {txn.refundInfo.refundId}
                  </a>
                </div>
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
                    {entry.actor} · {entry.actorType}
                  </p>
                </div>
                <span className="text-xs text-brand-gray-light shrink-0">
                  {entry.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Notes" && <NotesTab notes={txn.notes} />}

      {activeTab === "Location" && (
        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Location Info
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs text-brand-gray-light">Buyer Location</p>
              <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                {txn.location.buyerLocation}
              </p>
            </div>
            <div>
              <p className="text-xs text-brand-gray-light">Seller Location</p>
              <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                {txn.location.sellerLocation}
              </p>
            </div>
            <div>
              <p className="text-xs text-brand-gray-light">Approx Distance</p>
              <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                {txn.location.approxDistance}
              </p>
            </div>
            <div>
              <p className="text-xs text-brand-gray-light">Meeting Area</p>
              <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                {txn.location.meetingArea}
              </p>
            </div>
          </div>

          <ListingLocationMap
            lat={txn.location.lat}
            lng={txn.location.lng}
            label={txn.location.meetingArea}
          />
          <p className="text-sm text-brand-gray-dark dark:text-gray-200 mt-3">
            {txn.location.address}
          </p>
          <a
            href={`https://www.google.com/maps?q=${txn.location.lat},${txn.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg hover:bg-[#93C5FD] mt-3"
          >
            Open in Google Maps
          </a>
        </div>
      )}

      {reminderModalOpen && (
        <SendReminderModal
          buyerName={txn.parties.buyer.name}
          lastNotified="Jul 10, 2025 · 9:00 AM"
          onClose={() => setReminderModalOpen(false)}
          onSend={handleSendReminder}
        />
      )}

      {receiptModalOpen && (
        <ReceiptModal txn={txn} onClose={() => setReceiptModalOpen(false)} />
      )}

      {refundModalOpen && txn.refundInfo && (
        <RefundDetailsModal
          refundInfo={txn.refundInfo}
          onClose={() => setRefundModalOpen(false)}
        />
      )}
    </div>
  );
}

function NotesTab({ notes }: { notes: TransactionDetail["notes"] }) {
  const [newNote, setNewNote] = useState("");

  return (
    <div className="detail-section-card border-none">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
          Internal Notes
        </p>
        <button className="flex items-center gap-1 text-xs text-brand-blue hover:underline">
          <FiPlus className="w-3.5 h-3.5" /> Add Note
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-[#EFF6FF] dark:bg-blue-950 rounded-lg p-3 group relative"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                {note.author}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-brand-gray-light">
                  {note.date}
                </span>
                <button className="text-brand-gray-light hover:text-brand-blue">
                  <FiEdit3 className="w-3 h-3" />
                </button>
                <button className="text-brand-gray-light hover:text-red-500">
                  <FiTrash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-1">
              {note.note}
            </p>
          </div>
        ))}
      </div>

      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Add a private note... Use @name to mention a team member"
        rows={3}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-brand-gray-light">
          Visible to admins only
        </span>
        <button className="flex items-center gap-1.5 bg-brand-blue text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#3F5EE0]">
          <LuNotepadText className="w-3 h-3" /> Add Note
        </button>
      </div>
    </div>
  );
}
