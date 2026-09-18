import type { ListingMedia } from "@/features/listings/types";

export type EscrowStatus = "held" | "frozen" | "released" | "refunded";

export interface EscrowParty {
  id: string;
  name: string;
  email: string;
  status: string;
  rolePlayed: string;
  slug: string;
}

export interface EscrowRow {
  slug: string;
  transaction: { _id: string; reference: string } | null;
  buyer: EscrowParty | null;
  seller: EscrowParty | null;
  listing: { id: string; title: string } | null;
  amountPaid: number;
  amountHeld: number;
  platformFee: number | null;
  sellerPayoutAmount: number | null;
  status: EscrowStatus;
  createdAt: string;
}

export interface EscrowsListParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}
export interface EscrowsListResponse {
  success: boolean;
  data: {
    results: EscrowRow[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface EscrowTransactionSummary {
  id: string;
  reference: string;
  status: string;
}

export interface EscrowListingCategory {
  _id: string;
  title: string;
}

export interface EscrowListingSummary {
  _id: string;
  title: string;
  description: string;
  category: EscrowListingCategory | null;
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

export interface EscrowActor {
  id: string;
  name: string;
  role: string;
  image?: string;
  rolePlayed: string;
}

export interface EscrowActivityLogEntry {
  id: string;
  slug: string;
  event: string;
  label: string;
  metadata?: Record<string, unknown>;
  actor: EscrowActor;
}

export interface EscrowTransactionNoteRecord {
  id: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  writtenBy: { id: string; name: string; role: string };
}

export interface EscrowDisputeInfo {
  createdAt: string;
  status: string;
  slug: string;
  reason: string;
}

export interface EscrowRefundTrigger {
  id: string | null;
  name: string;
  slug: string | null;
  role: string | null;
  rolePlayed: string;
}

export interface EscrowRefundInfo {
  id: string;
  slug: string;
  amount: number;
  reason: string;
  status: string;
  triggeredBy: EscrowRefundTrigger;
  payoutAccountNumber: string;
  payoutBankCode: string;
  refundedAt: string;
  reference: string;
  createdAt: string;
}

export interface EscrowInsights {
  amountHeld: number;
  platformCommission: number;
  sellerReceivable: number;
  holdingDuration: string;
  currentStage: string;
}

export interface EscrowPlatformEarning {
  platformFee: number;
  processingFee: number;
  totalEarned: number;
}

export interface EscrowFinancialBreakdown {
  itemPrice: number;
  platformFee: number;
  platformFeePercentage: number;
  processingFee: number;
  processingFeePercentage: number;
  totalPaidByBuyer: number;
  sellerReceivable: number;
  refundAmount: number | null;
  netSettlement: number;
}

export interface EscrowPaymentDetails {
  paymentReference: string;
  paymentGateway: string;
  paymentMethod: string;
  paymentStatus: string;
  gatewayResponse: string;
  gatewayReference: string;
  currency: string;
  paymentDate: string;
  paymentTime: string;
}

export interface EscrowDetailRecord {
  id: string;
  slug: string;
  status: EscrowStatus;
  amount: number;
  createdAt: string;
  updatedAt: string;
  transaction: EscrowTransactionSummary | null;
  listing: EscrowListingSummary | null;
  seller: EscrowParty | null;
  buyer: EscrowParty | null;
  activityLog: EscrowActivityLogEntry[];
  transactionNotes: EscrowTransactionNoteRecord[];
  disputeInfo: EscrowDisputeInfo | null;
  refundInfo: EscrowRefundInfo | null;
  insights: EscrowInsights;
  platformEarning: EscrowPlatformEarning;
  financialBreakdown: EscrowFinancialBreakdown;
  paymentDetails: EscrowPaymentDetails;
  // Always null so far across held/frozen/refunded/released samples —
  // the backend hasn't started populating this yet.
  settlementDetails: unknown | null;
}

export interface EscrowDetailResponse {
  success: boolean;
  data: EscrowDetailRecord;
}
