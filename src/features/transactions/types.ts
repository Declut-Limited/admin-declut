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
  listing: { _id: string; title: string } | null;
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

export interface TransactionDetailResponse {
  success: boolean;
  data: TransactionRow;
}
export interface TransactionTimelineEvent {
  id: string;
  label: string;
  actor: string;
  actorType: string;
  detail: string;
  channels?: string[];
  date: string;
  completed: boolean;
}

export interface CommunicationLogEntry {
  id: string;
  channel: "Push" | "Email" | "SMS";
  direction: string;
  message: string;
  date: string;
}

export interface ActivityLogEntry {
  id: string;
  label: string;
  actor: string;
  actorType: string;
  date: string;
}

export interface InternalNote {
  id: string;
  author: string;
  note: string;
  date: string;
}

export interface TransactionDetail {
  code: string;
  status: "Active" | "Completed" | "Refunded" | "Disputed";
  createdDate: string;
  transactionAmount: string;
  escrowAmount: string;
  duration: string;
  currentStage: string;
  refundAmount?: string;
  stages: { label: string; state: "completed" | "current" | "pending" }[];
  deadline?: { label: string; date: string; remaining: string };
  slaRemaining?: string;
  product: {
    images: { id: string; url: string; isVideo?: boolean }[];
    name: string;
    category: string;
    brand: string;
    condition: string;
    price: string;
    location: string;
    listingId: string;
    listingStatus: string;
    listedOn: string;
    description: string;
    defectSummary?: string;
  };
  parties: {
    buyer: {
      name: string;
      id: string;
      email: string;
      avatarUrl?: string;
      status: "Active" | "Suspended";
      role: "Buyer";
    };
    seller: {
      name: string;
      id: string;
      email: string;
      avatarUrl?: string;
      status: "Active" | "Suspended";
      role: "Seller";
    };
  };
  payment: {
    reference: string;
    gateway: string;
    method: string;
    amountPaid: string;
    platformFee: string;
    processingFee: string;
    sellerReceivable: string;
  };
  escrowDetail: {
    reference: string;
    createdOn: string;
    status: string;
  };
  timeline: TransactionTimelineEvent[];
  communication: CommunicationLogEntry[];
  inspection: {
    status: "Pending" | "Completed" | "Disputed";
    deadline?: string;
    remaining?: string;
    reminderSent?: string;
    inspectionDate?: string;
    buyerConfirmation?: string;
    outcome?: string;
    notes?: string;
  };
  activityLog: ActivityLogEntry[];
  notes: InternalNote[];
  location: {
    buyerLocation: string;
    sellerLocation: string;
    approxDistance: string;
    meetingArea: string;
    address: string;
    lat: number;
    lng: number;
  };
  disputeInfo?: {
    disputeId: string;
    reason: string;
    category: string;
    opened: string;
    status: string;
    buyerStatement: string;
    sellerStatement: string;
    evidence: string[];
  };
  refundInfo?: {
    amount: string;
    reason: string;
    status: string;
    approvedBy: string;
    refundDate: string;
    settlementRef: string;
    resolutionTime: string;
    refundId: string;
  };
}
