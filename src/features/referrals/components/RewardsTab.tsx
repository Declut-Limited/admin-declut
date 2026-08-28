import { useMemo, useState } from "react";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import ConfirmModal from "@/components/generic/ConfirmModal";
import { createRewardColumns } from "./rewardColumns";
import ViewRewardModal from "./ViewRewardModal";
import { showToast } from "@/lib/utils/toast";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import type { Reward } from "../types";

// TODO: replace with /admin/referrals/rewards once available
const mockRewards: Reward[] = [
  { id: "RWD-003", participant: "Somto Nwosu", campaign: "August Marketplace Boost", reward: 10000, qualifiedOn: "2026-09-30", payment: "pending", schedule: "Manual Batch" },
  { id: "RWD-004", participant: "Hauwa Musa", campaign: "Hauwa Musa", reward: 5000, qualifiedOn: "2026-08-31", payment: "pending", schedule: "Manual Batch" },
  { id: "RWD-005", participant: "Femi Balogun", campaign: "Verified Seller Drive", reward: 3000, qualifiedOn: "2026-10-31", payment: "paid", schedule: "Manual Batch" },
  { id: "RWD-007", participant: "Nneka Obi", campaign: "June Referral Sprint", reward: 2000, qualifiedOn: "2026-06-30", payment: "paid", schedule: "Manual Batch" },
];

export default function RewardsTab() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [paymentFilter, setPaymentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewingReward, setViewingReward] = useState<Reward | null>(null);
  const [payingReward, setPayingReward] = useState<Reward | null>(null);

  const rewards = mockRewards;

  const columns = useMemo(
    () =>
      createRewardColumns({
        onView: (reward) => setViewingReward(reward),
        onDownloadReceipt: (reward) => {
          // TODO: wire receipt endpoint
          showToast.info("Receipt unavailable", {
            description: `No receipt endpoint yet for ${reward.id}.`,
          });
        },
        onPay: (reward) => setPayingReward(reward),
      }),
    [],
  );

  const visibleRewards = useMemo(() => {
    return rewards.filter((reward) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        reward.participant.toLowerCase().includes(q) ||
        reward.campaign.toLowerCase().includes(q) ||
        reward.id.toLowerCase().includes(q);

      const matchesPayment =
        !paymentFilter || reward.payment === paymentFilter.toLowerCase();

      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const qualified = new Date(reward.qualifiedOn).getTime();
        if (Number.isNaN(qualified)) matchesDate = false;
        else {
          if (
            dateRange.from &&
            qualified < new Date(dateRange.from).setHours(0, 0, 0, 0)
          )
            matchesDate = false;
          if (
            dateRange.to &&
            qualified > new Date(dateRange.to).setHours(23, 59, 59, 999)
          )
            matchesDate = false;
        }
      }

      return matchesSearch && matchesPayment && matchesDate;
    });
  }, [rewards, search, paymentFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(visibleRewards.length / PAGE_SIZE));

  const paginatedRewards = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleRewards.slice(start, start + PAGE_SIZE);
  }, [visibleRewards, currentPage]);

  return (
    <div>
      <TableToolbar
        label="Referrals"
        count={visibleRewards.length}
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search users..."
        filterSlot={
          <>
            <DateRangeFilter
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                setCurrentPage(1);
              }}
            />
            <FiltersButton activeCount={paymentFilter ? 1 : 0}>
              <CustomSelect
                label="Payment"
                value={paymentFilter || "All Payments"}
                options={["All Payments", "Pending", "Paid"]}
                onChange={(val) => {
                  setPaymentFilter(val === "All Payments" ? "" : val);
                  setCurrentPage(1);
                }}
              />
            </FiltersButton>
          </>
        }
      />

      <DataTable
        data={paginatedRewards}
        columns={columns}
        emptyMessage="No rewards found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {viewingReward && (
        <ViewRewardModal
          reward={viewingReward}
          onClose={() => setViewingReward(null)}
        />
      )}

      {payingReward && (
        <ConfirmModal
          title="Pay reward"
          message={`Pay ${payingReward.participant} for ${payingReward.campaign}? This creates a payout record.`}
          confirmLabel="Pay"
          variant="default"
          onClose={() => setPayingReward(null)}
          onConfirm={() => {
            // TODO: wire pay endpoint
            showToast.success("Reward paid", {
              description: `${payingReward.id} has been marked as paid.`,
            });
            setPayingReward(null);
          }}
        />
      )}
    </div>
  );
}