import type { ListingMedia } from "@/features/listings/types";

export type TransactionStatus =
  | "pending_payment"
  | "escrow_active"
  | "awaiting_inspection"
  | "completed"
  | "refunded"
  | "disputed"
  | "stalled"
  | "cancelled";

export type EscrowStatus = "held" | "released" | "refunded";
export type InspectionStatus = "awaiting" | "completed" | "failed";

export interface TransactionParty {
  id: string;
  name: string;
  email: string;
  status: string;
  rolePlayed: string;
  slug: string;
}

export interface TransactionRow {
  _id: string;
  listing: {
    _id: string;
    title: string;
    slug: string;
    mainImageUrl?: string | null;
  } | null;
  buyer: TransactionParty | null;
  seller: TransactionParty | null;
  amount: number;
  commissionPercentage: number;
  commissionAmount: number;
  sellerPayoutAmount: number;
  status: TransactionStatus;
  paystackReference: string;
  reference: string;
  escrow: { _id: string; status: EscrowStatus } | null;
  inspectionStatus: InspectionStatus;
  inspectionDeadlineAt: string | null;
  failedCodeAttempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionsListParams {
  page?: number;
  limit?: number;
  status?: string;
  tab?: string;
  startDate?: string;
  endDate?: string;
}

export interface TransactionsListResponse {
  success: boolean;
  data: {
    results: TransactionRow[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface TransactionListingCategory {
  _id: string;
  title: string;
}

export interface TransactionListingSummary {
  _id: string;
  title: string;
  description: string;
  category: TransactionListingCategory | null;
  condition: string;
  price: number;
  images: ListingMedia[];
  mainImageUrl: string | null;
  video?: ListingMedia;
  location: { type: string; coordinates: [number, number] } | null;
  locationLabel: string;
  address: string;
  hasDefect: boolean;
  defectDescription: string | null;
  status: string;
  slug: string;
  createdAt: string;
  brand?: string;
}

export interface TransactionActor {
  id: string;
  name: string;
  role: string;
  image?: string;
  rolePlayed: string;
}

export interface TransactionActivityLogEntry {
  id: string;
  slug: string;
  event: string;
  label: string;
  metadata?: Record<string, unknown>;
  actor: TransactionActor;
}

export interface TransactionCommunicationLogEntry {
  channel: "push" | "email" | "sms";
  recipient: string;
  title: string;
  body: string;
  sentAt: string;
}

export interface TransactionNoteRecord {
  id: string;
  description: string;
  createdAt: string;
  writtenBy?: { id: string; name: string; role: string };
}

export interface TransactionInsights {
  transactionAmount: number;
  escrowAmount: number;
  transactionDuration: string;
  currentStage: string;
}

export interface TransactionEscrowSummary {
  _id: string;
  slug: string;
  amount: number;
  status: EscrowStatus;
  createdAt: string;
}

export interface TransactionRefundInfo {
  id: string;
  slug: string;
  amount: number;
  reason: string;
  status: string;
  payoutAccountNumber: string;
  payoutBankCode: string;
  refundedAt: string;
  reference: string;
  createdAt: string;
  approvedBy: string | null;
}

export interface TransactionDetailRecord {
  _id: string;
  listing: TransactionListingSummary | null;
  buyer: TransactionParty | null;
  seller: TransactionParty | null;
  amount: number;
  commissionPercentage: number;
  commissionAmount?: number;
  sellerPayoutAmount?: number;
  gatewayProcessingFee: number;
  gateway: string;
  paymentMethod: string;
  status: TransactionStatus;
  reference: string;
  paystackReference?: string;
  inspectionStatus: InspectionStatus;
  inspectionExtended: boolean;
  inspectionExtendedBy?: number;
  inspectionExtensionEndDate?: string | null;
  inspectionPeriodEnded: boolean;
  inspectionReminderCount: number | null;
  inspectionOutcome: string;
  inspectionDeadlineAt?: string | null;
  confirmationCode?: string;
  failedCodeAttempts?: number;
  createdAt: string;
  updatedAt: string;
  escrow: TransactionEscrowSummary | null;
  activityLog: TransactionActivityLogEntry[];
  communicationLog: TransactionCommunicationLogEntry[];
  transactionNotes: TransactionNoteRecord[];
  insights: TransactionInsights;
  currentStage: string;
  refundInfo: TransactionRefundInfo | null;
  // Not present in any sample response yet — revisit once a disputed transaction example is available.
  disputeInfo?: unknown;
}

export interface TransactionDetailResponse {
  success: boolean;
  data: TransactionDetailRecord;
}
