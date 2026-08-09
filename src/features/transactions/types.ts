export interface TransactionRow {
  id: string;
  transactionCode: string;
  buyerName: string;
  buyerEmail: string;
  buyerAvatarUrl?: string;
  sellerName: string;
  sellerEmail: string;
  sellerAvatarUrl?: string;
  amount: string;
  product: string;
  escrow: "Held" | "Released" | "Refunded";
  inspection: "Awaiting" | "Completed" | "Failed";
  countdown: string;
  status: "Active" | "Completed" | "Refunded" | "Disputed";
  created: string;
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
  status: TransactionRow["status"];
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
    buyer: { name: string; id: string; email: string; avatarUrl?: string; status: "Active" | "Suspended"; role: "Buyer" };
    seller: { name: string; id: string; email: string; avatarUrl?: string; status: "Active" | "Suspended"; role: "Seller" };
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