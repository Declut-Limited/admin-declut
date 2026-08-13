/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiPrinter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiLock,
} from "react-icons/fi";
import { HiClock, HiOutlineReceiptRefund } from "react-icons/hi2";
import { TbFileDownload, TbRotate2 } from "react-icons/tb";
import ImageGallery from "@/components/generic/ImageGallery";
import Button from "@/components/generic/Button";
import NotFoundState from "@/components/generic/NotFoundState";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { EscrowDetail } from "../types";
import placeholderImage from "../../../assets/listing-main.jpg";
import { FaCheckCircle, FaClock, FaUser, FaWallet } from "react-icons/fa";
import layers from "@/assets/icons/layer-black.svg";
import frozen from "@/assets/icons/frozen.svg";
import { AiFillDollarCircle } from "react-icons/ai";
import { IoMail } from "react-icons/io5";
import { LuNotepadText } from "react-icons/lu";
import { RiLock2Fill } from "react-icons/ri";

const statusPillClass: Record<any, string> = {
  Held: "text-brand-blue bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  Frozen: "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950",
  Suspended: "text-pink-500 bg-pink-50 dark:text-pink-400 dark:bg-pink-950",
  Refunded:
    "text-[#7F22FE] bg-[#F5F3FF] dark:text-purple-400 dark:bg-purple-950",
  Released: "text-[#027A48] bg-[#ECFDF3] dark:text-green-400 dark:bg-green-950",
  Confirmed:
    "text-[#027A48] bg-[#ECFDF3] dark:text-green-400 dark:bg-green-950",
  Completed:
    "text-[#027A48] bg-[#ECFDF3] dark:text-green-400 dark:bg-green-950",
  Active: "text-[#027A48] bg-[#ECFDF3] dark:text-green-400 dark:bg-green-950",
  Resolved: "text-[#027A48] bg-[#ECFDF3] dark:text-green-400 dark:bg-green-950",
  Processed:
    "text-[#027A48] bg-[#ECFDF3] dark:text-green-400 dark:bg-green-950",
  Satisfied:
    "text-[#027A48] bg-[#ECFDF3] dark:text-green-400 dark:bg-green-950",
  Disputed: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  "Pending Review":
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
};

const tabsList = ["Overview", "Records", "Settlement", "Notes & Logs"];

const baseProduct: EscrowDetail["product"] = {
  images: [
    { id: "1", url: placeholderImage },
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
};

const baseParties: EscrowDetail["parties"] = {
  buyer: {
    name: "Kunle Abiola",
    id: "USR-001",
    email: "kunle.abiola@mail.com",
    status: "Active",
    role: "Buyer",
  },
  seller: {
    name: "Jenny Spears",
    id: "USR-003",
    email: "kunle.abiola@mail.com",
    status: "Active",
    role: "Seller",
  },
};

const baseFinancialBreakdown: EscrowDetail["financialBreakdown"] = {
  itemPrice: "₦850,000.00",
  platformFee: "– ₦42,500.00",
  processingFee: "– ₦8,500.00",
  taxes: "₦0.00",
  discountsApplied: "₦0.00",
  totalPaidByBuyer: "₦850,000.00",
  sellerReceivable: "₦799,000.00",
  refundAmount: "₦0.00",
  outstandingBalance: "₦0.00",
  netSettlementAmount: "₦799,000.00",
};

const mockEscrows: Record<string, EscrowDetail> = {
  // RELEASED
  "1": {
    code: "ESC-2026-08753",
    status: "Released",
    transactionId: "TXN-2026-001",
    createdDate: "Apr 9, 2026",
    amountHeld: "₦57,000",
    platformCommission: "₦57,000",
    sellerReceivable: "₦57,000",
    holdingDuration: "2d 6h 37m",
    currentStage: "Released",
    releaseDate: "12 Jul 2025",
    settlementTime: "10:35:42 WAT",
    settlementReference: "STL-REF-09214-NG",
    platformEarnings: {
      platformFee: "₦42,500",
      processingFee: "₦8,500",
      totalEarned: "₦51,000",
    },
    product: baseProduct,
    parties: baseParties,
    financialBreakdown: baseFinancialBreakdown,
    timeline: [
      {
        id: "1",
        label: "Payment secured by buyer",
        actor: "Adaeze Okonkwo",
        actorType: "App",
        detail: "₦485,000 received via bank transfer",
        date: "Jul 8 · 09:14",
      },
      {
        id: "2",
        label: "Escrow created",
        actor: "System",
        actorType: "Automatic",
        detail: "Funds held in escrow: ESC-2025-089341",
        date: "Jul 8 · 09:15",
      },
      {
        id: "3",
        label: "Seller notified",
        actor: "System",
        actorType: "Push + Email",
        detail: "Seller instructed to share contact details",
        date: "Jul 8 · 09:16",
      },
      {
        id: "4",
        label: "Seller details shared with buyer",
        actor: "Emeka Nwosu",
        actorType: "App",
        detail: "Phone and meeting location shared",
        date: "Jul 8 · 11:42",
      },
      {
        id: "5",
        label: "Inspection reminder sent",
        actor: "System",
        actorType: "Push + SMS",
        detail: "48-hour inspection window reminder",
        date: "Jul 9 · 10:00",
      },
      {
        id: "6",
        label: "Second inspection reminder sent",
        actor: "System",
        actorType: "Push + Email",
        detail: "24-hour final reminder",
        date: "Jul 10 · 09:00",
      },
      {
        id: "7",
        label: "Item inspected by buyer",
        actor: "Adaeze Okonkwo",
        actorType: "App",
        detail: "Physical inspection completed at Victoria Island",
        date: "Jul 11 · 14:15",
      },
      {
        id: "8",
        label: "Buyer confirmed item",
        actor: "Adaeze Okonkwo",
        actorType: "App",
        detail: "Item accepted as described",
        date: "Jul 11 · 15:52",
      },
      {
        id: "9",
        label: "Escrow released to seller",
        actor: "System",
        actorType: "Automatic",
        detail: "₦465,600 transferred to seller account",
        date: "Jul 11 · 15:53",
      },
    ],
    transactionSnapshot: {
      transactionId: "TXN-847291-NG",
      transactionStatus: "Completed",
      inspectionStatus: "Confirmed",
      buyerDecision: "Satisfied",
      refundStatus: "Not Requested",
    },
    disputeDetails: {
      hasDispute: false,
      message: "No Dispute Raised",
      subMessage:
        "Both parties reached a successful agreement. No dispute was filed for this escrow.",
    },
    refundDetails: {
      hasRefund: false,
      message: "No Refund Requested",
      subMessage:
        "The buyer confirmed satisfaction. No refund was initiated for this escrow transaction.",
    },
    paymentDetails: {
      paymentReference: "PAY-49102-NG",
      gatewayTransactionId: "ch_3Pz7xK2eZvKYlo2C1BZn4a",
      paymentGateway: "Paystack",
      paymentMethod: "Debit Card",
      cardType: "Mastercard ---- 4521",
      paymentStatus: "Captured",
      currency: "NGN (₦)",
      paymentDate: "11 Jul 2025",
      paymentTime: "09:12:07 WAT",
      gatewayResponse: "Transaction successful",
      gatewayReference: "GW-REF-7291-PAY",
      settlementBatchId: "STL-BATCH-0812",
    },
    settlementDetails: {
      settlementStatus: "Completed",
      expectedReleaseDate: "12 Jul 2025 · 11:00 WAT",
      actualReleaseDate: "12 Jul 2025 · 10:35 WAT",
      settlementReference: "STL-REF-09214-NG",
      bankName: "Zenith Bank",
      maskedBankAccount: "---- 8821",
      settlementAmount: "₦799,000.00",
      settlementBatch: "STL-BATCH-0812",
      settlementInitiatedBy: "System (Automated)",
      settlementCompletedBy: "System (Automated)",
      settlementTime: "10:35:42 WAT",
      settlementNotes:
        "Disbursed via Zenith Bank settlement API. No manual intervention.",
    },
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
        date: "Jul 8, 9:14 AM",
      },
    ],
  },

  // REFUNDED
  "2": {
    code: "ESC-2026-08753",
    status: "Refunded",
    transactionId: "TXN-2026-001",
    createdDate: "Apr 9, 2026",
    amountHeld: "₦57,000",
    platformCommission: "₦57,000",
    sellerReceivable: "₦57,000",
    holdingDuration: "2d 6h 37m",
    currentStage: "Refunded",
    refundDate: "12 Jul 2025",
    refundAmount: "₦850,000.00",
    refundReference: "RFD-REF-00812-NG",
    platformEarnings: {
      platformFee: "₦42,500",
      processingFee: "₦8,500",
      totalEarned: "₦51,000",
      feesReversed: true,
    },
    product: baseProduct,
    parties: baseParties,
    financialBreakdown: {
      ...baseFinancialBreakdown,
      sellerReceivable: "₦0.00",
      refundAmount: "₦850,000.00",
    },
    timeline: [
      {
        id: "1",
        label: "Buyer initiated payment",
        actor: "Adaeze Okonkwo",
        actorType: "App",
        detail: "₦485,000 received via bank transfer",
        date: "Jul 8 · 09:14",
      },
      {
        id: "2",
        label: "Escrow created",
        actor: "System",
        actorType: "Automatic",
        detail: "Funds held in escrow: ESC-2025-089341",
        date: "Jul 8 · 09:15",
      },
      {
        id: "3",
        label: "Refund requested",
        actor: "Adaeze Okonkwo",
        actorType: "",
        detail: "Reason: Item not as described",
        date: "Jul 8 · 09:16",
      },
      {
        id: "4",
        label: "Refund approved",
        actor: "Emeka Nwosu",
        actorType: "",
        detail: "Evidence reviewed, approved",
        date: "Jul 8 · 11:42",
      },
      {
        id: "5",
        label: "Refund processed",
        actor: "System",
        actorType: "Automatic",
        detail: "₦485,000 returned to buyer",
        date: "Jul 9 · 10:00",
      },
      {
        id: "6",
        label: "Escrow closed",
        actor: "System",
        actorType: "Automatic",
        detail: "Ref: RFD-REF-00812-NG",
        date: "Jul 11 · 15:52",
      },
    ],
    transactionSnapshot: {
      transactionId: "TXN-847291-NG",
      transactionStatus: "Refunded",
      inspectionStatus: "Disputed",
      buyerDecision: "Refund Requested",
      disputeStatus: "Resolved",
      refundStatus: "Processed",
    },
    disputeDetails: {
      hasDispute: false,
      message: "No Dispute Raised",
      subMessage:
        "Both parties reached a successful agreement. No dispute was filed for this escrow.",
    },
    refundDetails: {
      hasRefund: true,
      refundId: "RFD-00047-NG",
      refundReason: "Item not as described",
      refundAmountDetail: "₦850,000.00",
      refundStatus: "Processed",
      approvedBy: "Chisom Eze (Finance Officer)",
      refundDateDetail: "12 Jul 2025 · 14:22 WAT",
      refundReferenceDetail: "RFD-REF-00812-NG",
      settlementReversal: "N/A — pre-settlement refund",
      resolutionNotes:
        "Buyer submitted photo evidence of discrepancy. Refund approved after seller acknowledgement.",
    },
    paymentDetails: {
      paymentReference: "PAY-49102-NG",
      gatewayTransactionId: "ch_3Pz7xK2eZvKYlo2C1BZn4a",
      paymentGateway: "Paystack",
      paymentMethod: "Debit Card",
      cardType: "Mastercard ---- 4521",
      paymentStatus: "Refunded",
      currency: "NGN (₦)",
      paymentDate: "11 Jul 2025",
      paymentTime: "09:12:07 WAT",
      gatewayResponse: "Transaction reversed",
      gatewayReference: "GW-REF-7291-PAY",
      settlementBatchId: "N/A",
    },
    settlementDetails: {
      settlementStatus: "Reversed",
      expectedReleaseDate: "12 Jul 2025 · 11:00 WAT",
      actualReleaseDate: "N/A",
      settlementReference: "RFD-REF-00812-NG",
      bankName: "N/A",
      maskedBankAccount: "N/A",
      settlementAmount: "₦0.00",
      settlementBatch: "N/A",
      settlementInitiatedBy: "System (Automated)",
      settlementCompletedBy: "Chisom Eze (Finance Officer)",
      settlementTime: "14:22:00 WAT",
      settlementNotes:
        "Refund processed pre-settlement; no seller payout occurred.",
    },
    notes: [
      {
        id: "1",
        author: "Admin Chidi E.",
        note: "Buyer called support to confirm inspection process. Walked through the app flow. No issues.",
        date: "Jul 10, 2025 · 2:30 PM",
      },
    ],
    activityLog: [
      {
        id: "1",
        label: "Refund processed — ₦850,000 returned to Adaeze Okonkwo",
        actor: "System",
        actorType: "Automated",
        date: "Jul 12, 2:22 PM",
      },
      {
        id: "2",
        label: "Refund approved",
        actor: "Chisom Eze",
        actorType: "Finance Officer",
        date: "Jul 12, 1:50 PM",
      },
      {
        id: "3",
        label: "Refund requested",
        actor: "Adaeze Okonkwo",
        actorType: "Buyer",
        date: "Jul 8, 9:16 AM",
      },
    ],
  },

  // HELD
  "3": {
    code: "ESC-2026-08753",
    status: "Held",
    transactionId: "TXN-2026-001",
    createdDate: "Apr 9, 2026",
    amountHeld: "₦57,000",
    platformCommission: "₦57,000",
    sellerReceivable: "₦57,000",
    holdingDuration: "2d 6h 37m",
    currentStage: "Held",
    holdingTime: "14h 22m",
    inspectionDeadline: "13 Jul · 09:12 WAT",
    timeRemaining: "22:51:54",
    platformEarnings: {
      platformFee: "₦42,500",
      processingFee: "₦8,500",
      totalEarned: "₦51,000",
    },
    product: baseProduct,
    parties: baseParties,
    financialBreakdown: baseFinancialBreakdown,
    timeline: [
      {
        id: "1",
        label: "Buyer initiated payment",
        actor: "Adaeze Okonkwo",
        actorType: "",
        detail: "₦485,000 received via bank transfer",
        date: "Jul 8 · 09:14",
      },
      {
        id: "2",
        label: "Payment captured — ₦850,000 received",
        actor: "",
        actorType: "Paystack · Automatic",
        detail: "Auth code: AUTH_5kzn6p21",
        date: "Jul 8 · 09:15",
      },
      {
        id: "3",
        label: "Escrow account created",
        actor: "System",
        actorType: "",
        detail: "Escrow ID: ESC-2025-004729I",
        date: "Jul 8 · 09:16",
      },
      {
        id: "4",
        label: "Seller notified of payment",
        actor: "System",
        actorType: "",
        detail: "SMS + Email sent to Fatima A.",
        date: "Jul 8 · 11:42",
      },
      {
        id: "5",
        label: "Buyer received seller details",
        actor: "System",
        actorType: "Automatic",
        detail: "Pickup address shared securely",
        date: "Jul 9 · 10:00",
      },
      {
        id: "6",
        label: "Awaiting buyer inspection",
        actor: "",
        actorType: "",
        detail: "Deadline: 13 Jul 2025, 09:12 WAT",
        date: "Jul 11 · 15:52",
        isPending: true,
      },
    ],
    transactionSnapshot: {
      transactionId: "TXN-847291-NG",
      transactionStatus: "Active",
      inspectionStatus: "Awaiting",
      buyerDecision: "Pending",
      disputeStatus: "None",
      refundStatus: "Not Requested",
    },
    disputeDetails: {
      hasDispute: false,
      message: "No Dispute Raised",
      subMessage: "No dispute has been filed for this escrow.",
    },
    refundDetails: {
      hasRefund: false,
      message: "No Refund Requested",
      subMessage: "No refund has been initiated for this escrow transaction.",
    },
    paymentDetails: {
      paymentReference: "PAY-49102-NG",
      gatewayTransactionId: "ch_3Pz7xK2eZvKYlo2C1BZn4a",
      paymentGateway: "Paystack",
      paymentMethod: "Bank Transfer",
      cardType: "N/A",
      paymentStatus: "Captured",
      currency: "NGN (₦)",
      paymentDate: "8 Jul 2025",
      paymentTime: "09:14:00 WAT",
      gatewayResponse: "Transaction successful",
      gatewayReference: "GW-REF-7291-PAY",
      settlementBatchId: "Pending",
    },
    settlementDetails: {
      settlementStatus: "Pending",
      expectedReleaseDate: "13 Jul 2025 · 11:00 WAT",
      actualReleaseDate: "Pending",
      settlementReference: "Pending",
      bankName: "Zenith Bank",
      maskedBankAccount: "---- 8821",
      settlementAmount: "₦799,000.00",
      settlementBatch: "Pending",
      settlementInitiatedBy: "Not yet initiated",
      settlementCompletedBy: "Not yet completed",
      settlementTime: "Pending",
      settlementNotes:
        "Awaiting buyer inspection confirmation before settlement can proceed.",
    },
    notes: [],
    activityLog: [
      {
        id: "1",
        label: "Buyer notified of pickup details",
        actor: "System",
        actorType: "Automated",
        date: "Jul 9, 10:00 AM",
      },
      {
        id: "2",
        label: "Seller shared pickup address",
        actor: "Fatima A.",
        actorType: "Seller",
        date: "Jul 8, 11:42 AM",
      },
      {
        id: "3",
        label: "Escrow account created",
        actor: "System",
        actorType: "Automated",
        date: "Jul 8, 9:16 AM",
      },
      {
        id: "4",
        label: "Payment captured — ₦850,000",
        actor: "System",
        actorType: "Automated",
        date: "Jul 8, 9:15 AM",
      },
    ],
    inspectionPanel: {
      inspectionDeadline: "13 July, 2025 . 09:12 AM",
      countdown: "22:54:12 remaining",
      expectedReleaseDate: "13 July, 2025 . 11:00 AM",
      buyerContactStatus: "Notified",
      sellerContactStatus: "Notified",
      reminderHistory:
        "2 reminders sent (11 July, 09:14 AM, 12 July, 09:14 AM)",
    },
  },

  // FROZEN
  "4": {
    code: "ESC-2026-08753",
    status: "Frozen",
    transactionId: "TXN-2026-001",
    createdDate: "Apr 9, 2026",
    amountHeld: "₦57,000",
    platformCommission: "₦57,000",
    sellerReceivable: "₦57,000",
    holdingDuration: "2d 6h 37m",
    currentStage: "Frozen",
    freezeReason: "Suspected Fraud",
    frozenSince: "11 Jul · 23:45 WAT",
    assignedOfficer: "Kelechi Obi",
    slaRemainingFrozen: "22:34:57",
    platformEarnings: {
      platformFee: "₦42,500",
      processingFee: "₦8,500",
      totalEarned: "₦51,000",
    },
    product: baseProduct,
    parties: baseParties,
    financialBreakdown: baseFinancialBreakdown,
    timeline: [
      {
        id: "1",
        label: "Buyer initiated payment",
        actor: "Adaeze Okonkwo",
        actorType: "App",
        detail: "₦485,000 received via bank transfer",
        date: "Jul 8 · 09:14",
      },
      {
        id: "2",
        label: "Escrow created",
        actor: "System",
        actorType: "Automatic",
        detail: "Funds held in escrow: ESC-2025-089341",
        date: "Jul 8 · 09:15",
      },
      {
        id: "3",
        label: "Dispute opened",
        actor: "Adaeze Okonkwo",
        actorType: "App",
        detail: "Reason: Item significantly different from listing",
        date: "Jul 11 · 15:52",
      },
      {
        id: "4",
        label: "Escrow frozen pending investigation",
        actor: "System",
        actorType: "Automatic",
        detail: "Funds locked, awaiting admin review",
        date: "Jul 11 · 16:00",
        isPending: true,
      },
    ],
    transactionSnapshot: {
      transactionId: "TXN-847291-NG",
      transactionStatus: "Frozen",
      inspectionStatus: "Suspended",
      buyerDecision: "Under Review",
      disputeStatus: "Active",
      refundStatus: "Pending Review",
    },
    disputeDetails: {
      hasDispute: true,
      disputeId: "DSP-2026-NG",
      reason: "Suspected fraudulent activity",
      currentStage: "Evidence Review",
      assignedOfficer: "Kelechi Obi(Compliance Lead)",
      priority: "High",
      slaRemaining: "22:54:12",
      opened: "Jul 11, 2025, 3:52 PM",
    },
    refundDetails: {
      hasRefund: false,
      message: "No Refund Requested",
      subMessage:
        "Escrow is frozen pending dispute resolution. No refund has been initiated.",
    },
    paymentDetails: {
      paymentReference: "PAY-49102-NG",
      gatewayTransactionId: "ch_3Pz7xK2eZvKYlo2C1BZn4a",
      paymentGateway: "Paystack",
      paymentMethod: "Bank Transfer",
      cardType: "N/A",
      paymentStatus: "Captured",
      currency: "NGN (₦)",
      paymentDate: "8 Jul 2025",
      paymentTime: "09:14:00 WAT",
      gatewayResponse: "Transaction successful",
      gatewayReference: "GW-REF-7291-PAY",
      settlementBatchId: "On hold",
    },
    settlementDetails: {
      settlementStatus: "Frozen",
      expectedReleaseDate: "Suspended pending review",
      actualReleaseDate: "N/A",
      settlementReference: "N/A",
      bankName: "Zenith Bank",
      maskedBankAccount: "---- 8821",
      settlementAmount: "₦799,000.00",
      settlementBatch: "On hold",
      settlementInitiatedBy: "Suspended",
      settlementCompletedBy: "Suspended",
      settlementTime: "N/A",
      settlementNotes:
        "Settlement suspended due to open dispute DSP-2026-8764. Funds will remain frozen until resolution.",
    },
    notes: [
      {
        id: "1",
        author: "Admin Chidi E.",
        note: "Escrow frozen pending review of buyer's dispute claim. Evidence requested from both parties.",
        date: "Jul 11, 2025 · 4:05 PM",
      },
    ],
    activityLog: [
      {
        id: "1",
        label: "Escrow frozen — dispute under review",
        actor: "System",
        actorType: "Automated",
        date: "Jul 11, 4:00 PM",
      },
      {
        id: "2",
        label: "Dispute opened by buyer",
        actor: "Adaeze Okonkwo",
        actorType: "Buyer",
        date: "Jul 11, 3:52 PM",
      },
      {
        id: "3",
        label: "Escrow created",
        actor: "System",
        actorType: "Automated",
        date: "Jul 8, 9:15 AM",
      },
    ],
  },
};

export default function EscrowDetailPage() {
  const { escrowId } = useParams<{ escrowId: string }>();
  const navigate = useNavigate();
  const escrow = escrowId ? mockEscrows[escrowId] : undefined;
  const [activeTab, setActiveTab] = useState("Overview");

  if (!escrow) {
    return (
      <NotFoundState
        icon={<FiLock className="w-5 h-5" />}
        message="Escrow not found."
      />
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate("/escrows")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FiArrowLeft className="w-4 h-4" /> Back to Escrows
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl px-4 py-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#1D2939] dark:text-gray-100">
              {escrow.code}
            </h1>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[escrow.status]}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {escrow.status}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {escrow.transactionId} · Created {escrow.createdDate}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button leftIcon={<TbFileDownload className="w-4 h-4" />}>
            Receipt
          </Button>
          <Button leftIcon={<HiOutlineReceiptRefund className="w-4 h-4" />}>
            Export
          </Button>
          <Button
            leftIcon={<FiPrinter className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>
      </div>

      {/* status banner */}
      {escrow.status === "Released" && (
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#D0FAE5] dark:bg-green-900 rounded-full flex items-center justify-center p-3 shrink-0">
              <FaCheckCircle className="w-6 h-6 text-[#039855] dark:text-green-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                Funds have been successfully released to the seller
              </p>
              <p className="text-xs text-brand-gray-light dark:text-gray-400">
                Settlement completed. The seller has been paid.
              </p>
            </div>
          </div>
          <div className="text-right text-xs min-w-55">
            <div className="flex justify-between">
              <span className="text-brand-gray-light dark:text-brand-gray-light">
                Release Date
              </span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.releaseDate}
              </span>
            </div>
            <div className="flex gap-2 justify-between">
              <span className="text-brand-gray-light dark:text-brand-gray-light">
                Settlement Time
              </span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.settlementTime}
              </span>
            </div>
            <div className="flex gap-2 justify-between">
              <span className="text-brand-gray-light dark:text-brand-gray-light">
                Settlement Reference
              </span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.settlementReference}
              </span>
            </div>
          </div>
        </div>
      )}

      {escrow.status === "Refunded" && (
        <div className="flex items-center justify-between bg-[#F5F3FF] dark:bg-purple-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#EDE9FE] dark:bg-purple-900 rounded-full flex items-center justify-center p-3 shrink-0">
              <TbRotate2 className="w-6 h-6 text-[#7F22FE] dark:text-purple-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                Funds have been refunded to the buyer
              </p>
              <p className="text-xs text-brand-gray-light dark:text-gray-400">
                The escrow has been closed and the buyer has been reimbursed.
              </p>
            </div>
          </div>
          <div className="text-right text-xs min-w-55">
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Refund Date</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.refundDate}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Refund Amount</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.refundAmount}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Refund Reference</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.refundReference}
              </span>
            </div>
          </div>
        </div>
      )}

      {escrow.status === "Held" && (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#DBEAFE] dark:bg-blue-900 rounded-full flex items-center justify-center p-3 shrink-0">
              <RiLock2Fill className="w-6 h-6 text-brand-blue dark:text-blue-400" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                Funds are securely held in escrow
              </p>
              <p className="text-xs text-brand-gray-light dark:text-gray-400">
                Awaiting buyer inspection and confirmation before settlement.
              </p>
            </div>
          </div>
          <div className="text-right text-xs min-w-55">
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Holding Time</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.holdingTime}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Inspection Deadline</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.inspectionDeadline}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Time Remaining</span>
              <span className="font-medium text-brand-blue">
                {escrow.timeRemaining}
              </span>
            </div>
          </div>
        </div>
      )}

      {escrow.status === "Frozen" && (
        <div className="flex items-center justify-between bg-red-50 dark:bg-red-950 rounded-xl px-4 py-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#FFE2E2] dark:bg-red-900 rounded-full flex items-center justify-center p-3 shrink-0">
              <img src={frozen} className="w-6 h-6" />
            </span>
            <div>
              <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                This escrow is temporarily frozen
              </p>
              <p className="text-xs text-brand-gray-light dark:text-gray-400">
                Declut is currently reviewing this transaction. Funds are
                secured.
              </p>
            </div>
          </div>
          <div className="text-right text-xs min-w-55">
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Freeze Reason</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {escrow.freezeReason}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Frozen Since</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.frozenSince}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">Assigned Officer</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.assignedOfficer}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-brand-gray-light">SLA Remaining</span>
              <span className="font-medium text-brand-gray-dark dark:text-gray-400">
                {escrow.slaRemainingFrozen}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="detail-stat-card">
          <p className="detail-stat-value">{escrow.amountHeld}</p>
          <p className="detail-stat-label">
            <AiFillDollarCircle className="w-3.5 h-3.5" /> Amount Held
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">{escrow.platformCommission}</p>
          <p className="detail-stat-label">
            <FaWallet className="w-3.5 h-3.5" />
            Platform Commission
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">{escrow.sellerReceivable}</p>
          <p className="detail-stat-label">
            <FaUser className="w-3.5 h-3.5" />
            Seller Receivable
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">{escrow.holdingDuration}</p>
          <p className="detail-stat-label">
            <HiClock className="w-3.5 h-3.5" />
            Holding Duration
          </p>
        </div>
        <div className="detail-stat-card">
          <p className="detail-stat-value">{escrow.currentStage}</p>
          <p className="detail-stat-label">
            <img src={layers} className="w-4 h-4" /> Current Stage
          </p>
        </div>
      </div>

      {/* tabs */}
      <div className="flex items-center gap-5">
        {tabsList.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold ${activeTab === tab ? "text-brand-blue" : "text-brand-gray-light hover:text-brand-gray-dark"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Product Information
              </p>
              <ImageGallery images={escrow.product.images} />
              <p className="text-base font-semibold text-brand-gray-dark dark:text-gray-100 mt-3">
                {escrow.product.name}
              </p>
              <p className="text-xs text-brand-gray-light mb-3">
                {escrow.product.category}
              </p>

              <div className="flex flex-col">
                <div className="profile-info-row">
                  <span className="profile-info-label">Brand</span>
                  <span className="profile-info-value">
                    {escrow.product.brand}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Condition</span>
                  <span className="profile-info-value">
                    {escrow.product.condition}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Price</span>
                  <span className="profile-info-value">
                    {escrow.product.price}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Location</span>
                  <span className="profile-info-value">
                    {escrow.product.location}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Listing ID</span>
                  <a href="#" className="text-brand-blue hover:underline-wavy">
                    {escrow.product.listingId}
                  </a>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Listing Status</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                    {escrow.product.listingStatus}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Listed On</span>
                  <span className="profile-info-value">
                    {escrow.product.listedOn}
                  </span>
                </div>
              </div>

              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mt-4 mb-1 border-t border-gray-100 dark:border-gray-800 pt-3">
                Description
              </p>
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                {escrow.product.description}
              </p>

              {escrow.product.defectSummary && (
                <div className="mt-3">
                  <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-1">
                    Seller's Defect Summary
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 rounded-lg px-3 py-2">
                    {escrow.product.defectSummary}
                  </p>
                </div>
              )}
            </div>

            {/* Parties */}
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Parties
              </p>
              {[escrow.parties.buyer, escrow.parties.seller].map((party) => (
                <div
                  key={party.id}
                  className="flex items-center justify-between gap-2.5 py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={party.avatarUrl || avatarPlaceholder}
                      alt={party.name}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#1D2939] dark:text-gray-100">
                          {party.name}
                        </p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                          {party.status}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${party.role === "Seller" ? "text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-950" : "text-[#7F22FE] bg-[#F5F3FF] dark:text-purple-400 dark:bg-purple-950"}`}
                        >
                          {party.role}
                        </span>
                      </div>
                      <p className="text-xs text-brand-gray-light">
                        {party.id} · {party.email}
                      </p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-brand-gray-light hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <IoMail className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Held-only inspection panel */}
            {escrow.status === "Held" && escrow.inspectionPanel && (
              <div className="detail-section-card border-none">
                <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
                  Inspection Panel
                </p>
                <div className="profile-info-row">
                  <span className="profile-info-label">
                    Inspection Deadline
                  </span>
                  <span className="profile-info-value">
                    {escrow.inspectionPanel.inspectionDeadline}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Countdown</span>
                  <span className="text-sm font-medium text-brand-blue">
                    {escrow.inspectionPanel.countdown}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">
                    Expected Release Date
                  </span>
                  <span className="profile-info-value">
                    {escrow.inspectionPanel.expectedReleaseDate}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">
                    Buyer Contact Status
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                    {escrow.inspectionPanel.buyerContactStatus}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">
                    Seller Contact Status
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                    {escrow.inspectionPanel.sellerContactStatus}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Reminder History</span>
                  <span className="profile-info-value">
                    {escrow.inspectionPanel.reminderHistory}
                  </span>
                </div>
              </div>
            )}

            {/* Financial breakdown */}
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
                Financial Breakdown
              </p>
              <div className="profile-info-row">
                <span className="profile-info-label">Item Price</span>
                <span className="profile-info-value">
                  {escrow.financialBreakdown.itemPrice}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Platform Fee (5%)</span>
                <span className="text-red-500">
                  {escrow.financialBreakdown.platformFee}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">
                  Payment Processing Fee (1%)
                </span>
                <span className="text-red-500">
                  {escrow.financialBreakdown.processingFee}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Taxes</span>
                <span className="profile-info-value">
                  {escrow.financialBreakdown.taxes}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Discounts Applied</span>
                <span className="profile-info-value">
                  {escrow.financialBreakdown.discountsApplied}
                </span>
              </div>
              <div className="profile-info-row bg-gray-50 dark:bg-gray-800/50 -mx-2 px-2 rounded">
                <span className="profile-info-label">Total Paid by Buyer</span>
                <span className="profile-info-value">
                  {escrow.financialBreakdown.totalPaidByBuyer}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Seller Receivable</span>
                <span className="text-sm font-semibold text-green-600">
                  {escrow.financialBreakdown.sellerReceivable}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Refund Amount</span>
                <span
                  className={
                    escrow.status === "Refunded"
                      ? "text-sm font-semibold text-amber-600"
                      : "profile-info-value"
                  }
                >
                  {escrow.financialBreakdown.refundAmount}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Outstanding Balance</span>
                <span className="profile-info-value">
                  {escrow.financialBreakdown.outstandingBalance}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">
                  Net Settlement Amount
                </span>
                <span className="text-sm font-semibold text-green-600">
                  {escrow.financialBreakdown.netSettlementAmount}
                </span>
              </div>
            </div>

            {/* Transaction timeline */}
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Transaction Timeline
              </p>
              <div className="relative">
                {escrow.timeline.map((event, i) => {
                  const isPaymentEvent =
                    event.label.toLowerCase().includes("payment") ||
                    event.label.toLowerCase().includes("initiated payment");
                  const isFinalEvent =
                    event.label.toLowerCase().includes("escrow released") ||
                    event.label.toLowerCase().includes("escrow closed");
                  return (
                    <div
                      key={event.id}
                      className="relative flex gap-3 pb-6 last:pb-0"
                    >
                      {i < escrow.timeline.length - 1 && (
                        <span className="absolute left-2.25 top-6 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                      )}
                      {i === 0 && isPaymentEvent ? (
                        <span className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center shrink-0 z-10">
                          <span className="text-white text-[10px] font-bold">
                            ₦
                          </span>
                        </span>
                      ) : isFinalEvent ? (
                        <span className="w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center shrink-0 z-10">
                          <FiCheckCircle className="w-3 h-3 text-white" />
                        </span>
                      ) : event.isPending ? (
                        <span className="w-5 h-5 rounded-full border-2 border-amber-400 bg-white dark:bg-gray-900 flex items-center justify-center shrink-0 z-10">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border-2 border-brand-blue bg-white dark:bg-gray-900 flex items-center justify-center shrink-0 z-10">
                          <span className="w-2 h-2 rounded-full bg-brand-blue" />
                        </span>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                            {event.label}
                          </p>
                          <span className="text-xs text-brand-gray-light shrink-0">
                            {event.date}
                          </span>
                        </div>
                        {(event.actor || event.actorType) && (
                          <div className="flex items-center gap-2 mt-1">
                            {event.actor && (
                              <span className="text-sm text-brand-gray-dark dark:text-gray-200">
                                {event.actor}
                              </span>
                            )}
                            {event.actorType && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-brand-gray-dark dark:text-gray-300">
                                {event.actorType}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-brand-gray-light mt-1">
                          {event.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Transaction snapshot */}
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
                Transaction Snapshot
              </p>
              <div className="profile-info-row">
                <span className="profile-info-label">Transaction ID</span>
                <a href="#" className="text-brand-blue">
                  {escrow.transactionSnapshot.transactionId}
                </a>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Transaction Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[escrow.transactionSnapshot.transactionStatus]}`}
                >
                  {escrow.transactionSnapshot.transactionStatus}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Inspection Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[escrow.transactionSnapshot.inspectionStatus]}`}
                >
                  {escrow.transactionSnapshot.inspectionStatus}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Buyer Decision</span>
                <span className="text-sm font-medium text-amber-600">
                  {escrow.transactionSnapshot.buyerDecision}
                </span>
              </div>
              {escrow.transactionSnapshot.disputeStatus && (
                <div className="profile-info-row">
                  <span className="profile-info-label">Dispute Status</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[escrow.transactionSnapshot.disputeStatus]}`}
                  >
                    {escrow.transactionSnapshot.disputeStatus}
                  </span>
                </div>
              )}
              {escrow.transactionSnapshot.refundStatus && (
                <div className="profile-info-row">
                  <span className="profile-info-label">Refund Status</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[escrow.transactionSnapshot.refundStatus]}`}
                  >
                    {escrow.transactionSnapshot.refundStatus}
                  </span>
                </div>
              )}
              <button
                onClick={() =>
                  navigate(`/transactions/${escrow.transactionId}`)
                }
                className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg hover:bg-[#93C5FD] mt-3 cursor-pointer"
              >
                View Full Transaction Record
              </button>
            </div>
          </div>

          {/* Platform Earnings */}
          <PlatformEarningsCard earnings={escrow.platformEarnings} />
        </div>
      )}

      {/* RECORDS */}
      {activeTab === "Records" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Dispute Details
              </p>
              {!escrow.disputeDetails.hasDispute ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <FaCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </span>
                  <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                    {escrow.disputeDetails.message}
                  </p>
                  <p className="text-xs text-brand-gray-light max-w-xs">
                    {escrow.disputeDetails.subMessage}
                  </p>
                </div>
              ) : (
                <>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Dispute ID</span>
                    <a
                      href="#"
                      className="text-brand-blue hover:underline-wavy"
                    >
                      {escrow.disputeDetails.disputeId}
                    </a>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Reason</span>
                    <span className="profile-info-value">
                      {escrow.disputeDetails.reason}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400">
                      {escrow.disputeDetails.status ||
                        escrow.disputeDetails.priority}
                    </span>
                  </div>
                  {escrow.disputeDetails.currentStage && (
                    <div className="profile-info-row">
                      <span className="profile-info-label">Current Stage</span>
                      <span className="profile-info-value">
                        {escrow.disputeDetails.currentStage}
                      </span>
                    </div>
                  )}
                  {escrow.disputeDetails.assignedOfficer && (
                    <div className="profile-info-row">
                      <span className="profile-info-label">
                        Assigned Officer
                      </span>
                      <span className="profile-info-value">
                        {escrow.disputeDetails.assignedOfficer}
                      </span>
                    </div>
                  )}
                  <div className="profile-info-row">
                    <span className="profile-info-label">Opened</span>
                    <span className="profile-info-value">
                      {escrow.disputeDetails.opened}
                    </span>
                  </div>
                  {escrow.disputeDetails.slaRemaining && (
                    <div className="profile-info-row">
                      <span className="profile-info-label">SLA Remaining</span>
                      <span className="profile-info-value text-[#F04438] dark:text-red-500">
                        {escrow.disputeDetails.slaRemaining}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() =>
                      navigate(`/disputes/${escrow.disputeDetails.disputeId}`)
                    }
                    className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg hover:bg-[#93C5FD] mt-3"
                  >
                    View Full Dispute Record
                  </button>
                </>
              )}
            </div>

            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Refund Details
              </p>
              {!escrow.refundDetails.hasRefund ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <FaCheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </span>
                  <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                    {escrow.refundDetails.message}
                  </p>
                  <p className="text-xs text-brand-gray-light max-w-xs">
                    {escrow.refundDetails.subMessage}
                  </p>
                </div>
              ) : (
                <>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund ID</span>
                    <a
                      href="#"
                      className="text-brand-blue hover:underline-wavy"
                    >
                      {escrow.refundDetails.refundId}
                    </a>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Reason</span>
                    <span className="profile-info-value">
                      {escrow.refundDetails.refundReason}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Amount</span>
                    <span className="profile-info-value">
                      {escrow.refundDetails.refundAmountDetail}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Status</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400">
                      {escrow.refundDetails.refundStatus}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Approved By</span>
                    <span className="profile-info-value">
                      {escrow.refundDetails.approvedBy}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Date</span>
                    <span className="profile-info-value">
                      {escrow.refundDetails.refundDateDetail}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Refund Reference</span>
                    <a
                      href="#"
                      className="text-brand-blue hover:underline-wavy"
                    >
                      {escrow.refundDetails.refundReferenceDetail}
                    </a>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">
                      Settlement Reversal
                    </span>
                    <span className="profile-info-value">
                      {escrow.refundDetails.settlementReversal}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mt-3 mb-1">
                    Resolution Notes
                  </p>
                  <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                    {escrow.refundDetails.resolutionNotes}
                  </p>
                </>
              )}
            </div>
          </div>

          <PlatformEarningsCard earnings={escrow.platformEarnings} />
        </div>
      )}

      {/* SETTLEMENT */}
      {activeTab === "Settlement" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
                Payment Details
              </p>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Reference</span>
                <a href="#" className="text-brand-blue hover:underline-wavy">
                  {escrow.paymentDetails.paymentReference}
                </a>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">
                  Gateway Transaction ID
                </span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.gatewayTransactionId}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Gateway</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.paymentGateway}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Method</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.paymentMethod}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Card Type</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.cardType}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Status</span>
                <span className="text-sm font-medium text-green-600">
                  {escrow.paymentDetails.paymentStatus}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Currency</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.currency}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Date</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.paymentDate}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Time</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.paymentTime}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Gateway Response</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.gatewayResponse}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Gateway Reference</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.gatewayReference}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Batch ID</span>
                <span className="profile-info-value">
                  {escrow.paymentDetails.settlementBatchId}
                </span>
              </div>
            </div>
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
                Settlement Details
              </p>

              {escrow.status === "Held" || escrow.status === "Frozen" ? (
                <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                  <span className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FaClock className="w-5 h-5 text-brand-gray-dark dark:text-gray-400" />
                  </span>
                  <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                    No Settlement Yet
                  </p>
                  <p className="text-xs text-brand-gray-light max-w-xs">
                    Settlement details will appear here once the buyer has
                    confirmed receipt and funds are released to the seller.
                  </p>
                </div>
              ) : (
                <>
                  <div className="profile-info-row">
                    <span className="profile-info-label">
                      Settlement Status
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {escrow.settlementDetails.settlementStatus}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">
                      Expected Release Date
                    </span>
                    <span className="profile-info-value">
                      {escrow.settlementDetails.expectedReleaseDate}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">
                      Actual Release Date
                    </span>
                    <span className="profile-info-value">
                      {escrow.settlementDetails.actualReleaseDate}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">
                      Settlement Reference
                    </span>
                    <a
                      href="#"
                      className="text-brand-blue hover:underline-wavy"
                    >
                      {escrow.settlementDetails.settlementReference}
                    </a>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Bank Name</span>
                    <span className="profile-info-value">
                      {escrow.settlementDetails.bankName}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">
                      Masked Bank Account
                    </span>
                    <span className="profile-info-value">
                      {escrow.settlementDetails.maskedBankAccount}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">
                      Settlement Amount
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      {escrow.settlementDetails.settlementAmount}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Settlement Batch</span>
                    <span className="profile-info-value">
                      {escrow.settlementDetails.settlementBatch}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">
                      Settlement Initiated By
                    </span>
                    <span className="profile-info-value">
                      {escrow.settlementDetails.settlementInitiatedBy}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">
                      Settlement Completed By
                    </span>
                    <span className="profile-info-value">
                      {escrow.settlementDetails.settlementCompletedBy}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Settlement Time</span>
                    <span className="profile-info-value">
                      {escrow.settlementDetails.settlementTime}
                    </span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Settlement Notes</span>
                    <span className="profile-info-value text-right max-w-xs">
                      {escrow.settlementDetails.settlementNotes}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <PlatformEarningsCard earnings={escrow.platformEarnings} />
        </div>
      )}

      {/* NOTES & LOGS */}
      {activeTab === "Notes & Logs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <NotesSection notes={escrow.notes} />

            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Activity Log
              </p>
              <div className="flex flex-col">
                {escrow.activityLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0"
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
          </div>
          <PlatformEarningsCard earnings={escrow.platformEarnings} />
        </div>
      )}
    </div>
  );
}

function NotesSection({ notes }: { notes: EscrowDetail["notes"] }) {
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
        {notes.length === 0 ? (
          <p className="text-sm text-brand-gray-light">
            No internal notes yet.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 group relative"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                  {note.author}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-gray-light">
                    {note.date}
                  </span>
                  <button className="text-brand-gray-light hover:text-brand-blue opacity-0 group-hover:opacity-100">
                    <FiEdit2 className="w-3 h-3" />
                  </button>
                  <button className="text-brand-gray-light hover:text-red-500 opacity-0 group-hover:opacity-100">
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-1">
                {note.note}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a private note... Use @name to mention a team member"
          rows={3}
          className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 text-sm placeholder:text-gray-400 focus:outline-none resize-none"
        />
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <span className="text-xs text-brand-gray-light">
            Visible to admins only
          </span>
          <button className="flex items-center gap-1.5 bg-brand-blue text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-[#3F5EE0]">
            <LuNotepadText className="w-3 h-3" /> Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

function PlatformEarningsCard({
  earnings,
}: {
  earnings: EscrowDetail["platformEarnings"];
}) {
  return (
    <div className="detail-section-card border-none h-fit">
      <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
        Platform Earnings
      </p>
      <div className="profile-info-row">
        <span className="profile-info-label">Platform Fee</span>
        <span className="profile-info-value">{earnings.platformFee}</span>
      </div>
      <div className="profile-info-row border-b pb-2 border-gray-200 dark:border-gray-500">
        <span className="profile-info-label">Processing Fee</span>
        <span className="profile-info-value">{earnings.processingFee}</span>
      </div>
      <div className="profile-info-row">
        <span className="profile-info-label">Total Earned</span>
        <span className="text-sm font-semibold text-brand-blue">
          {earnings.totalEarned}
        </span>
      </div>
      {earnings.feesReversed && (
        <p className="text-xs text-amber-600 mt-1">Fees reversed on refund</p>
      )}
    </div>
  );
}
