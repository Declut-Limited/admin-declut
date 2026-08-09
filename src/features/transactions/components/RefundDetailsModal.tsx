import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import { FiCheckCircle, FiDownload } from "react-icons/fi";
import type { TransactionDetail } from "../types";

interface RefundDetailsModalProps {
  refundInfo: NonNullable<TransactionDetail["refundInfo"]>;
  onClose: () => void;
}

export default function RefundDetailsModal({
  refundInfo,
  onClose,
}: RefundDetailsModalProps) {
  return (
    <BaseModal
      title="Refund Details"
      onClose={onClose}
      width="max-w-md"
      footer={
        <>
          <Button
            onClick={onClose}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            Close
          </Button>
          <Button
            leftIcon={<FiDownload className="w-4 h-4" />}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
          >
            Download Receipt
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3 bg-[#F5F3FF] dark:bg-purple-950 rounded-lg px-3 py-3 mb-4">
        <span className="w-9 h-9 rounded-full bg-[#EDE9FE] dark:bg-purple-900 flex items-center justify-center shrink-0">
          <FiCheckCircle className="w-4 h-4 text-[#7F22FE] dark:text-purple-400" />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#5D0EC0] dark:text-purple-300">
            Refund Successfully Processed
          </p>
          <p className="text-xs text-[#7008E7] dark:text-purple-400">
            Funds returned to buyer on {refundInfo.refundDate}.
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="profile-info-row">
          <span className="profile-info-label">Refund ID</span>
          <a href="#" className="text-brand-blue hover:underline-wavy">
            {refundInfo.refundId}
          </a>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Refund Amount</span>
          <span className="profile-info-value">{refundInfo.amount}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Reason</span>
          <span className="profile-info-value">{refundInfo.reason}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Status</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
            {refundInfo.status}
          </span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Approved By</span>
          <span className="profile-info-value">{refundInfo.approvedBy}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Refund Date</span>
          <span className="profile-info-value">{refundInfo.refundDate}</span>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Settlement Ref</span>
          <a href="#" className="text-brand-blue hover:underline-wavy">
            {refundInfo.settlementRef}
          </a>
        </div>
        <div className="profile-info-row">
          <span className="profile-info-label">Resolution Time</span>
          <span className="profile-info-value">
            {refundInfo.resolutionTime}
          </span>
        </div>
      </div>
    </BaseModal>
  );
}
