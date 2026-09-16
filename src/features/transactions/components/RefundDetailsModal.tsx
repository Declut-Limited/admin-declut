import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import { FiCheckCircle } from "react-icons/fi";
import { currency, formatDateTime, formatLabel } from "../statusStyles";
import type { RefundSummary } from "../refund";

interface RefundDetailsModalProps {
  refund: RefundSummary;
  onClose: () => void;
}

export default function RefundDetailsModal({
  refund,
  onClose,
}: RefundDetailsModalProps) {
  const isVerified = refund.refundReference != null;

  return (
    <BaseModal
      title="Refund Details"
      onClose={onClose}
      width="max-w-md"
      footer={
        <Button
          onClick={onClose}
          bgColor="bg-white dark:bg-gray-900"
          textColor="text-brand-gray-dark dark:text-gray-200"
          borderColor="border-gray-200 dark:border-gray-700"
        >
          Close
        </Button>
      }
    >
      <div className="flex items-center gap-3 bg-[#F5F3FF] dark:bg-purple-950 rounded-lg px-3 py-3 mb-4">
        <span className="w-9 h-9 rounded-full bg-[#EDE9FE] dark:bg-purple-900 flex items-center justify-center shrink-0">
          <FiCheckCircle className="w-4 h-4 text-[#7F22FE] dark:text-purple-400" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#5D0EC0] dark:text-purple-300">
            {refund.status ? formatLabel(refund.status) : "Refund Processed"}
          </p>
          <p className="text-xs text-[#7008E7] dark:text-purple-400">
            Funds returned to the buyer
            {refund.refundedAt
              ? ` on ${formatDateTime(refund.refundedAt)}`
              : ""}
            .
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        {refund.refundReference && (
          <div className="profile-info-row">
            <span className="profile-info-label">Refund Reference</span>
            <span className="profile-info-value">{refund.refundReference}</span>
          </div>
        )}
        <div className="profile-info-row">
          <span className="profile-info-label">Refund Amount</span>
          <span className="profile-info-value">
            {refund.refundAmount != null
              ? currency.format(refund.refundAmount)
              : "—"}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Commission Retained</span>
          <span className="profile-info-value">
            {refund.commissionRetained != null
              ? currency.format(refund.commissionRetained)
              : "—"}
          </span>
        </div>
        {refund.reason && (
          <div className="profile-info-row">
            <span className="profile-info-label">Reason</span>
            <span className="profile-info-value">{refund.reason}</span>
          </div>
        )}
        <div className="profile-info-row">
          <span className="profile-info-label">Escrow Status</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
            {refund.escrowStatus ? formatLabel(refund.escrowStatus) : "—"}
          </span>
        </div>
        {(refund.payoutAccountNumber || refund.payoutBankCode) && (
          <div className="profile-info-row">
            <span className="profile-info-label">Payout Account</span>
            <span className="profile-info-value">
              {refund.payoutAccountNumber ?? "—"}
              {refund.payoutBankCode ? ` (Bank ${refund.payoutBankCode})` : ""}
            </span>
          </div>
        )}
        <div className="profile-info-row">
          <span className="profile-info-label">Approved By</span>
          <span className="profile-info-value">
            {refund.approvedBy ?? "System (auto-approved)"}
          </span>
        </div>
      </div>

      {!isVerified && (
        <p className="text-xs text-brand-gray-light mt-4">
          Full refund metadata isn't available for this transaction — the
          backend's <span className="font-mono">refundInfo</span> came back{" "}
          <span className="font-mono">null</span>, so the figures above are
          derived from the activity log instead.
        </p>
      )}
    </BaseModal>
  );
}
