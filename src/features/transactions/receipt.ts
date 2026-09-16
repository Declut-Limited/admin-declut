import type { TransactionDetailRecord } from "./types";

export interface ReceiptData {
  reference: string;
  createdAt: string;
  buyerName: string;
  sellerName: string;
  itemName: string;
  amountPaid: number;
  platformFee: number;
  processingFee: number;
  sellerReceivable: number | null;
  paymentMethod: string;
  gateway: string;
  escrowReference: string | null;
}

export function buildReceiptFromRecord(record: TransactionDetailRecord): ReceiptData {
  const platformFee =
    record.commissionAmount ??
    Math.round((record.amount * record.commissionPercentage) / 100);
  const sellerReceivable =
    record.sellerPayoutAmount ??
    (record.commissionAmount != null
      ? record.amount - record.commissionAmount - record.gatewayProcessingFee
      : null);

  return {
    reference: record.reference,
    createdAt: record.createdAt,
    buyerName: record.buyer?.name ?? "—",
    sellerName: record.seller?.name ?? "—",
    itemName: record.listing?.title ?? "—",
    amountPaid: record.amount,
    platformFee,
    processingFee: record.gatewayProcessingFee,
    sellerReceivable,
    paymentMethod: record.paymentMethod,
    gateway: record.gateway,
    escrowReference: record.escrow?.slug ?? null,
  };
}
