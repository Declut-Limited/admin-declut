import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FiUsers, FiEdit3, FiTrash2, FiPlus } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { PiExportFill } from "react-icons/pi";
import { IoPrintOutline } from "react-icons/io5";
import { BsCheckCircleFill } from "react-icons/bs";
import Button from "@/components/generic/Button";
import NotFoundState from "@/components/generic/NotFoundState";
import { showToast } from "@/lib/utils/toast";

const TABS = ["Overview", "Records", "Settlement", "Notes & Logs"] as const;
type DetailTab = (typeof TABS)[number];

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// TODO: replace with /admin/referrals/participants/{id} once available
const mockDetail = {
  id: "1",
  name: "Amara Okafor",
  status: "Approved",
  campaignName: "August Marketplace Boost",
  reference: "TXN-2026-001",
  createdAt: "2026-04-09",
  potentialReward: 57000,
  referredUsers: 6,
  qualifiedReferrals: 3,
  ownTransactions: "2/2",
  rewardAmountPaid: 0,
  platformEarnings: {
    platformFee: 42500,
    processingFee: 8500,
    totalEarned: 51000,
  },
  dispute: null,
  refund: null,
  payment: {
    reference: "PAY-49102-NG",
    gatewayTransactionId: "ch_3Pz7xK2eZvKYIo2C1BZn4a",
    gateway: "Paystack",
    method: "Debit Card",
    cardType: "Mastercard — 4521",
    status: "Captured",
    currency: "NGN (₦)",
    date: "11 Jul 2025",
    time: "09:12:07 WAT",
    gatewayResponse: "Transaction successful",
    gatewayReference: "GW-REF-7291-PAY",
    settlementBatchId: "STL-BATCH-0812",
  },
  settlement: {
    status: "Completed",
    expectedReleaseDate: "12 Jul 2025 · 11:00 WAT",
    actualReleaseDate: "12 Jul 2025 · 10:35 WAT",
    reference: "STL-REF-09214-NG",
    bankName: "Zenith Bank",
    maskedBankAccount: "•••• •••• 8821",
    amount: 799000,
    batch: "STL-BATCH-0812",
    initiatedBy: "System (Automated)",
    completedBy: "System (Automated)",
    time: "10:35:42 WAT",
    notes: "Disbursed via Zenith Bank settlement API. No manual intervention.",
  },
  notes: [
    { id: "1", author: "Admin Chidi E.", timestamp: "Jul 10, 2025 · 2:30 PM", body: "Buyer called support to confirm inspection process. Walked through the app flow. No issues." },
    { id: "2", author: "Admin Fatima O.", timestamp: "Jul 11, 2025 · 9:15 AM", body: "Seller confirmed item is ready for pickup at Lekki Phase 1. Buyer acknowledged." },
  ],
  activityLog: [
    { label: "Viewed transaction details", actor: "Admin Fatima O. · Operations Admin", date: "Jul 12", time: "10:42 AM" },
    { label: "Escrow released — ₦465,600 transferred to Emeka Nwosu", actor: "System · Automated", date: "Jul 11", time: "3:53 PM" },
    { label: "Confirmed item receipt and released payment", actor: "Adaeze Okonkwo · Buyer", date: "Jul 11", time: "3:52 PM" },
    { label: "Marked inspection as complete", actor: "Adaeze Okonkwo · Buyer", date: "Jul 11", time: "2:15 PM" },
    { label: "Final 24h inspection reminder dispatched (Push + Email)", actor: "System · Automated", date: "Jul 10", time: "9:00 AM" },
    { label: "48h inspection reminder dispatched (Push + SMS)", actor: "System · Automated", date: "Jul 9", time: "10:00 AM" },
    { label: "Shared contact details with buyer", actor: "Emeka Nwosu · Seller", date: "Jul 8", time: "11:42 AM" },
  ],
  referrals: [
    { id: "REF-001", user: "Amara Okoro", qualifiedOn: "2026-09-30", progress: "2/2", transaction: "TXN-86453", status: "Qualified" },
    { id: "REF-001", user: "Tunde Adebayo", qualifiedOn: "2026-08-31", progress: "2/2", transaction: "TXN-86453", status: "Qualified" },
    { id: "REF-001", user: "Bisi Alade", qualifiedOn: "2026-10-31", progress: "1/2", transaction: "TXN-86453", status: "Qualified" },
    { id: "REF-001", user: "Ibrahim Sani", qualifiedOn: "2026-06-30", progress: "0/2", transaction: "TXN-86453", status: "Qualified" },
  ],
  transactions: [
    { id: "TXN-001", referredUser: "Amara Okoro", product: "MacBook Pro 2021", amount: 10000, date: "2026-09-30", buyer: "-", seller: "Amara Okoro", status: "Completed" },
    { id: "TXN-001", referredUser: "Tunde Adebayo", product: "MacBook Pro 2021", amount: 10000, date: "2026-08-31", buyer: "Tunde Adebayo", seller: "-", status: "Completed" },
    { id: "TXN-001", referredUser: "Bisi Alade", product: "MacBook Pro 2021", amount: 10000, date: "2026-10-31", buyer: "Bisi Alade", seller: "-", status: "Completed" },
    { id: "TXN-001", referredUser: "Ibrahim Sani", product: "MacBook Pro 2021", amount: 10000, date: "2026-06-30", buyer: "-", seller: "Ibrahim Sani", status: "Completed" },
  ],
  timeline: [
    { label: "Participant joined campaign", timestamp: "18 Sep 2026 · 09:10" },
    { label: "First referral registered", timestamp: "18 Sep 2026 · 09:10" },
    { label: "Qualifying transaction completed", timestamp: "18 Sep 2026 · 09:10" },
  ],
};

export default function ParticipantDetailPage() {
  const { participantId } = useParams<{ participantId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DetailTab>("Overview");
  const [noteDraft, setNoteDraft] = useState("");

  const participant = participantId ? mockDetail : undefined;

  if (!participant) {
    return (
      <NotFoundState
        icon={<FiUsers className="w-5 h-5" />}
        message="Participant not found."
      />
    );
  }

  const stats = [
    { label: "Potential Reward", value: currency.format(participant.potentialReward) },
    { label: "Referred Users", value: String(participant.referredUsers) },
    { label: "Qualified Referrals", value: String(participant.qualifiedReferrals) },
    { label: "Own Transactions", value: participant.ownTransactions },
    { label: "Reward Amount Paid", value: currency.format(participant.rewardAmountPaid) },
  ];

  const handleAddNote = () => {
    if (!noteDraft.trim()) return;
    // TODO: wire add-note endpoint
    showToast.success("Note added", { description: "Your note is visible to admins only." });
    setNoteDraft("");
  };

  const platformEarnings = (
    <div className="detail-section-card border-none h-fit">
      <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
        Platform Earnings
      </p>
      <div className="profile-info-row">
        <span className="profile-info-label">Platform Fee</span>
        <span className="profile-info-value">
          {currency.format(participant.platformEarnings.platformFee)}
        </span>
      </div>
      <div className="profile-info-row">
        <span className="profile-info-label">Processing Fee</span>
        <span className="profile-info-value">
          {currency.format(participant.platformEarnings.processingFee)}
        </span>
      </div>
      <div className="profile-info-row">
        <span className="profile-info-label">Total Earned</span>
        <span className="text-sm font-semibold text-brand-blue">
          {currency.format(participant.platformEarnings.totalEarned)}
        </span>
      </div>
    </div>
  );

  return (
    <div>
      <button
        onClick={() => navigate("/referrals?tab=Participants")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FaArrowLeftLong className="w-4 h-4" /> Back to Participants
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-[#FAFAFA] dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#1D2939] dark:text-gray-100 tracking-wide">
              {participant.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#027A48]" />
              {participant.status}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {participant.campaignName} · {participant.reference} · Created{" "}
            {formatDate(participant.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            onClick={() => {
              /* TODO: wire export */
            }}
          >
            Export
          </Button>
          <Button
            leftIcon={<IoPrintOutline className="w-4 h-4 text-[#98A2B3]" />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="detail-stat-card">
            <p className="detail-stat-value">{stat.value}</p>
            <p className="detail-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div className="referral-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`referral-tab ${activeTab === tab ? "referral-tab-active" : ""}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <div className="flex flex-col gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Referred Users
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-brand-gray-light">
                    <th className="font-medium pb-2">ID</th>
                    <th className="font-medium pb-2">Referred User</th>
                    <th className="font-medium pb-2">Qualified On</th>
                    <th className="font-medium pb-2">Progress</th>
                    <th className="font-medium pb-2">Transaction</th>
                    <th className="font-medium pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participant.referrals.map((row, i) => (
                    <tr key={`${row.id}-${i}`} className="border-t border-gray-50 dark:border-gray-800">
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">{row.id}</td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">{row.user}</td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">{formatDate(row.qualifiedOn)}</td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">{row.progress}</td>
                      <td className="py-2.5">
                        <button
                          type="button"
                          onClick={() => navigate(`/transactions/${row.transaction}`)}
                          className="text-brand-blue underline cursor-pointer"
                        >
                          {row.transaction}
                        </button>
                      </td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-brand-blue dark:bg-blue-950 dark:text-blue-400">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Transactions
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-brand-gray-light">
                    <th className="font-medium pb-2">ID</th>
                    <th className="font-medium pb-2">Referred User</th>
                    <th className="font-medium pb-2">Product Name</th>
                    <th className="font-medium pb-2">Amount</th>
                    <th className="font-medium pb-2">Date</th>
                    <th className="font-medium pb-2">Buyer</th>
                    <th className="font-medium pb-2">Seller</th>
                    <th className="font-medium pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participant.transactions.map((row, i) => (
                    <tr key={`${row.id}-${i}`} className="border-t border-gray-50 dark:border-gray-800">
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">{row.id}</td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">{row.referredUser}</td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">{row.product}</td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">{currency.format(row.amount)}</td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">{formatDate(row.date)}</td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">{row.buyer}</td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">{row.seller}</td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-brand-blue dark:bg-blue-950 dark:text-blue-400">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Timeline
            </p>
            <div className="flex flex-col">
              {participant.timeline.map((event, i) => (
                <div key={i} className="border-l-2 border-[#BFDBFE] pl-4 pb-4 relative last:pb-0">
                  <span className="absolute -left-1.25 top-1 w-2 h-2 rounded-full bg-brand-blue" />
                  <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                    {event.label}
                  </p>
                  <p className="text-xs text-brand-gray-light mt-0.5">{event.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Records" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Dispute Details
              </p>
              {participant.dispute ? (
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {/* TODO: populated dispute shape not provided */}
                  —
                </p>
              ) : (
                <div className="record-empty-state">
                  <BsCheckCircleFill className="w-6 h-6 text-[#12B76A]" />
                  <p className="record-empty-title">No Dispute Raised</p>
                  <p className="record-empty-body">
                    Both parties reached a successful agreement. No dispute was filed for this escrow.
                  </p>
                </div>
              )}
            </div>

            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Refund Details
              </p>
              {participant.refund ? (
                <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                  {/* TODO: populated refund shape not provided */}
                  —
                </p>
              ) : (
                <div className="record-empty-state">
                  <BsCheckCircleFill className="w-6 h-6 text-[#12B76A]" />
                  <p className="record-empty-title">No Refund Requested</p>
                  <p className="record-empty-body">
                    The buyer confirmed satisfaction. No refund was initiated for this escrow transaction.
                  </p>
                </div>
              )}
            </div>
          </div>

          {platformEarnings}
        </div>
      )}

      {activeTab === "Settlement" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Payment Details
              </p>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Reference</span>
                <span className="profile-info-value">{participant.payment.reference}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Gateway Transaction ID</span>
                <span className="profile-info-value">{participant.payment.gatewayTransactionId}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Gateway</span>
                <span className="profile-info-value">{participant.payment.gateway}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Method</span>
                <span className="profile-info-value">{participant.payment.method}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Card Type</span>
                <span className="profile-info-value">{participant.payment.cardType}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                  {participant.payment.status}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Currency</span>
                <span className="profile-info-value">{participant.payment.currency}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Date</span>
                <span className="profile-info-value">{participant.payment.date}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Time</span>
                <span className="profile-info-value">{participant.payment.time}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Gateway Response</span>
                <span className="profile-info-value">{participant.payment.gatewayResponse}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Gateway Reference</span>
                <span className="profile-info-value">{participant.payment.gatewayReference}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Batch ID</span>
                <span className="profile-info-value">{participant.payment.settlementBatchId}</span>
              </div>
            </div>

            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Settlement Details
              </p>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Status</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                  {participant.settlement.status}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Expected Release Date</span>
                <span className="profile-info-value">{participant.settlement.expectedReleaseDate}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Actual Release Date</span>
                <span className="profile-info-value">{participant.settlement.actualReleaseDate}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Reference</span>
                <span className="profile-info-value">{participant.settlement.reference}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Bank Name</span>
                <span className="profile-info-value">{participant.settlement.bankName}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Masked Bank Account</span>
                <span className="profile-info-value">{participant.settlement.maskedBankAccount}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Amount</span>
                <span className="profile-info-value">{currency.format(participant.settlement.amount)}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Batch</span>
                <span className="profile-info-value">{participant.settlement.batch}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Initiated By</span>
                <span className="profile-info-value">{participant.settlement.initiatedBy}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Completed By</span>
                <span className="profile-info-value">{participant.settlement.completedBy}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Time</span>
                <span className="profile-info-value">{participant.settlement.time}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Settlement Notes</span>
                <span className="profile-info-value">{participant.settlement.notes}</span>
              </div>
            </div>
          </div>

          {platformEarnings}
        </div>
      )}

      {activeTab === "Notes & Logs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="detail-section-card border-none">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
                  Internal Notes
                </p>
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="flex items-center gap-1 text-xs text-brand-blue hover:underline cursor-pointer"
                >
                  <FiPlus className="w-3.5 h-3.5" /> Add Note
                </button>
              </div>

              <div className="flex flex-col gap-3 mb-4">
                {participant.notes.map((note) => (
                  <div key={note.id} className="internal-note">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                        {note.author}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-brand-gray-light">{note.timestamp}</span>
                        <button
                          type="button"
                          onClick={() => {
                            /* TODO: wire edit note */
                          }}
                          className="text-brand-gray-light hover:text-brand-gray-dark cursor-pointer"
                          aria-label="Edit note"
                        >
                          <FiEdit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            /* TODO: wire delete note */
                          }}
                          className="text-brand-gray-light hover:text-[#F04438] cursor-pointer"
                          aria-label="Delete note"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-brand-gray-dark dark:text-gray-300 mt-1">
                      {note.body}
                    </p>
                  </div>
                ))}
              </div>

              <div className="note-composer">
                <textarea
                  rows={3}
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Add a private note.. Use @name to mention a team member"
                  className="note-composer-input"
                />
                <div className="note-composer-footer">
                  <span className="text-xs text-brand-gray-light">Visible to admins only</span>
                  <Button
                    onClick={handleAddNote}
                    disabled={!noteDraft.trim()}
                    bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
                    textColor="text-white"
                    borderColor="border-transparent"
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </div>

            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Activity Log
              </p>
              <div className="flex flex-col">
                {participant.activityLog.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 dark:border-gray-800 last:border-b-0"
                  >
                    <div>
                      <p className="text-sm text-brand-gray-dark dark:text-gray-100">{entry.label}</p>
                      <p className="text-xs text-brand-gray-light mt-0.5">{entry.actor}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-brand-gray-light">{entry.date}</p>
                      <p className="text-xs text-brand-gray-light">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {platformEarnings}
        </div>
      )}
    </div>
  );
}