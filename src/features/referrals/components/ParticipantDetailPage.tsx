import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUsers } from "react-icons/fi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoPrintOutline } from "react-icons/io5";
import Button from "@/components/generic/Button";
import NotFoundState from "@/components/generic/NotFoundState";
import PageLoader from "@/components/generic/PageLoader";
import Pagination from "@/components/generic/Pagination";
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import {
  statusPillClass as txnStatusPillClass,
  statusFallback as txnStatusFallback,
  formatLabel as formatTxnStatus,
} from "@/features/transactions/statusStyles";
import { useReferralParticipant } from "../queries";

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

function formatDateTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ParticipantDetailPage() {
  const { participantId } = useParams<{ participantId: string }>();
  const navigate = useNavigate();

  const [referralsPage, setReferralsPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);

  const {
    data: participant,
    isLoading,
    isError,
    error,
  } = useReferralParticipant(participantId, {
    referralsPage,
    referralsLimit: 10,
    transactionsPage,
    transactionsLimit: 10,
  });

  if (!participantId) {
    return (
      <NotFoundState
        icon={<FiUsers className="w-5 h-5" />}
        message="Participant not found."
      />
    );
  }

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !participant) {
    return (
      <NotFoundState
        icon={<FiUsers className="w-5 h-5" />}
        message={getApiErrorMessage(error, "Couldn't load this participant.")}
      />
    );
  }

  const stats = [
    {
      label: "Potential Reward",
      value: currency.format(participant.insights.potentialReward),
    },
    {
      label: "Referred Users",
      value: String(participant.insights.referredUsers),
    },
    {
      label: "Qualified Referrals",
      value: String(participant.insights.qualifiedReferrals),
    },
    {
      label: "Own Transactions",
      value: participant.insights.ownTransactions,
    },
    {
      label: "Reward Amount Paid",
      value: currency.format(participant.insights.rewardAmountPaid),
    },
  ];

  return (
    <div className="print-area">
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
              {participant.participant.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6FEF9] text-[#027A48] dark:bg-green-950 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#027A48]" />
              {formatStatus(participant.status)}
            </span>
          </div>
          <p className="text-xs text-brand-gray-light mt-0.5">
            {participant.participant.email} · {participant.campaign.name} ·
            Joined {formatDate(participant.joinedAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
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

      <div className="flex flex-col gap-6">
        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Referred Users
          </p>
          {participant.referredUsers.results.length === 0 ? (
            <div className="detail-empty-state">No referred users yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-brand-gray-light">
                    <th className="font-medium pb-2">Referred User</th>
                    <th className="font-medium pb-2">Referred At</th>
                    <th className="font-medium pb-2">Qualified At</th>
                    <th className="font-medium pb-2">Challenge</th>
                  </tr>
                </thead>
                <tbody>
                  {participant.referredUsers.results.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-gray-50 dark:border-gray-800"
                    >
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">
                        {row.referredUser?.name ?? "—"}
                      </td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                        {formatDate(row.referredAt)}
                      </td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                        {row.qualifiedAt ? formatDate(row.qualifiedAt) : "—"}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            row.hasCompletedChallenge
                              ? "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950"
                              : "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950"
                          }`}
                        >
                          {row.hasCompletedChallenge
                            ? "Completed"
                            : "In Progress"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={referralsPage}
                totalPages={Math.max(
                  1,
                  Math.ceil(
                    participant.referredUsers.total /
                      participant.referredUsers.limit,
                  ),
                )}
                onPageChange={setReferralsPage}
              />
            </div>
          )}
        </div>

        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Transactions
          </p>
          {participant.transactions.results.length === 0 ? (
            <div className="detail-empty-state">No transactions yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-brand-gray-light">
                    <th className="font-medium pb-2">Product</th>
                    <th className="font-medium pb-2">Amount</th>
                    <th className="font-medium pb-2">Date</th>
                    <th className="font-medium pb-2">Buyer</th>
                    <th className="font-medium pb-2">Seller</th>
                    <th className="font-medium pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {participant.transactions.results.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-gray-50 dark:border-gray-800"
                    >
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-200">
                        {row.productName}
                      </td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                        {currency.format(row.amount)}
                      </td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                        {formatDate(row.date)}
                      </td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                        {row.buyer}
                      </td>
                      <td className="py-2.5 text-brand-gray-dark dark:text-gray-300">
                        {row.seller}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            txnStatusPillClass[row.status] ?? txnStatusFallback
                          }`}
                        >
                          {formatTxnStatus(row.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                currentPage={transactionsPage}
                totalPages={Math.max(
                  1,
                  Math.ceil(
                    participant.transactions.total /
                      participant.transactions.limit,
                  ),
                )}
                onPageChange={setTransactionsPage}
              />
            </div>
          )}
        </div>

        <div className="detail-section-card border-none">
          <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
            Timeline
          </p>
          {participant.timeline.length === 0 ? (
            <div className="detail-empty-state">No activity yet.</div>
          ) : (
            <div className="flex flex-col">
              {participant.timeline.map((event, i) => (
                <div
                  key={`${event.event}-${i}`}
                  className="border-l-2 border-[#BFDBFE] pl-4 pb-4 relative last:pb-0"
                >
                  <span className="absolute -left-1.25 top-1 w-2 h-2 rounded-full bg-brand-blue" />
                  <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                    {event.label}
                  </p>
                  <p className="text-xs text-brand-gray-light mt-0.5">
                    {formatDateTime(event.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
