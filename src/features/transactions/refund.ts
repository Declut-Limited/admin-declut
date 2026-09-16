import type { TransactionDetailRecord } from "./types";

export interface RefundSummary {
  refundAmount: number | null;
  commissionRetained: number | null;
  escrowStatus: string | null;
  reason: string | null;
  status: string | null;
  refundedAt: string | null;
  refundReference: string | null;
  payoutAccountNumber: string | null;
  payoutBankCode: string | null;
  approvedBy: string | null;
}

export function buildRefundSummary(
  record: TransactionDetailRecord,
  fallbackRefundAmount?: number,
  fallbackCommission?: number,
): RefundSummary {
  const info = record.refundInfo;

  return {
    refundAmount: info?.amount ?? fallbackRefundAmount ?? null,
    commissionRetained: fallbackCommission ?? record.commissionAmount ?? null,
    escrowStatus: record.escrow?.status ?? null,
    reason: info?.reason ?? null,
    status: info?.status ?? null,
    refundedAt: info?.refundedAt ?? record.updatedAt,
    refundReference: info?.slug ?? null,
    payoutAccountNumber: info?.payoutAccountNumber ?? null,
    payoutBankCode: info?.payoutBankCode ?? null,
    approvedBy: info?.approvedBy ?? null,
  };
}
