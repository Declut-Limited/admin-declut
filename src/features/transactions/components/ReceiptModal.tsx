import BaseModal from "@/components/generic/BaseModal";
import Button from "@/components/generic/Button";
import { FiPrinter } from "react-icons/fi";
import type { TransactionDetail } from "../types";
import { TbFileDownload } from "react-icons/tb";

interface ReceiptModalProps {
  txn: TransactionDetail;
  onClose: () => void;
}

export default function ReceiptModal({ txn, onClose }: ReceiptModalProps) {
  return (
    <BaseModal
      title="Transaction Receipt"
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
          <Button leftIcon={<TbFileDownload className="w-4 h-4" />}>
            Download PDF
          </Button>
          <Button
            leftIcon={<FiPrinter className="w-4 h-4" />}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
            onClick={() => window.print()}
          >
            Print
          </Button>
        </>
      }
    >
      <div className="pl-6 pr-4 py-4">
        <div className="-mx-6 -mt-4 bg-brand-blue text-white text-center py-6 px-6 rounded-t-2xl">
          <p className="text-xs text-blue-100 uppercase tracking-wide">
            Declut Escrow Receipt
          </p>
          <p className="text-3xl font-bold mt-1">{txn.payment.amountPaid}</p>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/20 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Transaction Complete
          </span>
        </div>

        <div className="-mx-6 px-6 pb-6 border border-t-0 border-gray-100 dark:border-gray-800 rounded-b-2xl">
          <div className="flex flex-col pt-4">
            <div className="profile-info-row">
              <span className="profile-info-label">Transaction ID</span>
              <a href="#" className="text-brand-blue">{txn.code}</a>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Date</span>
              <span className="profile-info-value">{txn.createdDate}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Buyer</span>
              <span className="profile-info-value">{txn.parties.buyer.name}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Seller</span>
              <span className="profile-info-value">{txn.parties.seller.name}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Item</span>
              <span className="profile-info-value">{txn.product.name}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Amount Paid</span>
              <span className="profile-info-value">{txn.payment.amountPaid}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Platform Fee</span>
              <span className="profile-info-value">{txn.payment.platformFee}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Processing Fee</span>
              <span className="profile-info-value">{txn.payment.processingFee}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Seller Received</span>
              <span className="text-sm font-semibold text-green-600">{txn.payment.sellerReceivable}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Payment Method</span>
              <span className="profile-info-value">{txn.payment.method}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Gateway</span>
              <span className="profile-info-value">{txn.payment.gateway}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Settlement Ref</span>
              <a href="#" className="text-brand-blue">{txn.escrowDetail.reference}</a>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}