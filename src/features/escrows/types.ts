export interface EscrowRow {
  id: string;
  escrowId: string;
  transactionId: string;
  buyerName: string;
  buyerEmail: string;
  buyerAvatarUrl?: string;
  sellerName: string;
  sellerEmail: string;
  sellerAvatarUrl?: string;
  product: string;
  amountHeld: string;
  platformFee: string;
  sellerReceivable: string;
  status: "Held" | "Frozen" | "Refunded" | "Released";
}

export interface EscrowTimelineEvent {
  id: string;
  label: string;
  actor: string;
  actorType?: string;
  detail: string;
  date: string;
  isPending?: boolean;
}

export interface EscrowNote {
  id: string;
  author: string;
  note: string;
  date: string;
}

export interface EscrowActivityEntry {
  id: string;
  label: string;
  actor: string;
  actorType: string;
  date: string;
}

export interface EscrowDetail {
  code: string;
  status: EscrowRow["status"];
  transactionId: string;
  createdDate: string;

  amountHeld: string;
  platformCommission: string;
  sellerReceivable: string;
  holdingDuration: string;
  currentStage: string;

  // status-specific banner data
  releaseDate?: string;
  settlementTime?: string;
  settlementReference?: string;

  refundDate?: string;
  refundAmount?: string;
  refundReference?: string;

  holdingTime?: string;
  inspectionDeadline?: string;
  timeRemaining?: string;

  freezeReason?: string;
frozenSince?: string;
assignedOfficer?: string;
slaRemainingFrozen?: string;

  platformEarnings: {
    platformFee: string;
    processingFee: string;
    totalEarned: string;
    feesReversed?: boolean;
  };

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

  financialBreakdown: {
    itemPrice: string;
    platformFee: string;
    processingFee: string;
    taxes: string;
    discountsApplied: string;
    totalPaidByBuyer: string;
    sellerReceivable: string;
    refundAmount: string;
    outstandingBalance: string;
    netSettlementAmount: string;
  };

  timeline: EscrowTimelineEvent[];

  transactionSnapshot: {
    transactionId: string;
    transactionStatus: string;
    inspectionStatus: string;
    buyerDecision: string;
    refundStatus?: string;
    disputeStatus?: string;
  };

  // Records tab
  disputeDetails: {
    hasDispute: boolean;
    message?: string;
    subMessage?: string;
    disputeId?: string;
    reason?: string;
    status?: string;
    opened?: string;
    priority?: string;
    currentStage?: string;
    assignedOfficer?: string;
    slaRemaining?: string;
  };
  refundDetails: {
    hasRefund: boolean;
    message?: string;
    subMessage?: string;
    refundId?: string;
    refundReason?: string;
    refundAmountDetail?: string;
    refundStatus?: string;
    approvedBy?: string;
    refundDateDetail?: string;
    refundReferenceDetail?: string;
    settlementReversal?: string;
    resolutionNotes?: string;
  };

  // Settlement tab
  paymentDetails: {
    paymentReference: string;
    gatewayTransactionId: string;
    paymentGateway: string;
    paymentMethod: string;
    cardType: string;
    paymentStatus: string;
    currency: string;
    paymentDate: string;
    paymentTime: string;
    gatewayResponse: string;
    gatewayReference: string;
    settlementBatchId: string;
  };
  settlementDetails: {
    settlementStatus: string;
    expectedReleaseDate: string;
    actualReleaseDate: string;
    settlementReference: string;
    bankName: string;
    maskedBankAccount: string;
    settlementAmount: string;
    settlementBatch: string;
    settlementInitiatedBy: string;
    settlementCompletedBy: string;
    settlementTime: string;
    settlementNotes: string;
  };

  // Notes & Logs tab
  notes: EscrowNote[];
  activityLog: EscrowActivityEntry[];

  // Held-only inspection panel
  inspectionPanel?: {
    inspectionDeadline: string;
    countdown: string;
    expectedReleaseDate: string;
    buyerContactStatus: string;
    sellerContactStatus: string;
    reminderHistory: string;
  };
}
