import { useEffect, useMemo, useState } from "react";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import ConfirmModal from "@/components/generic/ConfirmModal";
import { PiExportFill } from "react-icons/pi";
import { FiCheckCircle } from "react-icons/fi";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import { showToast } from "@/lib/utils/toast";
import { usePageSize } from "@/lib/hooks/usePageSize";
import {
  useReferralCampaigns,
  useReferralRewards,
  useExportReferralRewards,
  useMarkRewardPaid,
  useBulkMarkRewardsPaid,
} from "../queries";
import { createRewardColumns } from "./rewardColumns";
import ViewRewardModal from "./ViewRewardModal";
import type { ReferralRewardListItem } from "../types";

const STATUS_OPTIONS = ["All Statuses", "Pending", "Paid", "Canceled"];

export default function RewardsTab() {
  const PAGE_SIZE = usePageSize();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [viewingReward, setViewingReward] =
    useState<ReferralRewardListItem | null>(null);
  const [markingPaidReward, setMarkingPaidReward] =
    useState<ReferralRewardListItem | null>(null);
  const [bulkMarkPaidOpen, setBulkMarkPaidOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const campaignsQuery = useReferralCampaigns({ page: 1, limit: 100 });
  const campaigns = campaignsQuery.data?.results ?? [];
  const campaignOptions = [
    "All Campaigns",
    ...Array.from(new Set(campaigns.map((c) => c.name))),
  ];
  const selectedCampaignId = campaigns.find((c) => c.name === campaignFilter)
    ?._id;

  const rewardsQuery = useReferralRewards({
    page: currentPage,
    limit: PAGE_SIZE,
    status: statusFilter ? statusFilter.toLowerCase() : undefined,
    campaignId: selectedCampaignId,
    search: debouncedSearch || undefined,
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });

  const { data } = rewardsQuery;
  const rewards = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const { mutateAsync: exportRewards } = useExportReferralRewards();
  const { mutateAsync: markPaid, isPending: isMarkingPaid } =
    useMarkRewardPaid();
  const { mutateAsync: bulkMarkPaid, isPending: isBulkMarkingPaid } =
    useBulkMarkRewardsPaid();

  const selectedPendingIds = useMemo(
    () =>
      rewards
        .filter((r) => selectedIds.has(r._id) && r.payment === "pending")
        .map((r) => r._id),
    [rewards, selectedIds],
  );

  const allSelected =
    rewards.length > 0 && rewards.every((r) => selectedIds.has(r._id));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        rewards.forEach((r) => next.delete(r._id));
      } else {
        rewards.forEach((r) => next.add(r._id));
      }
      return next;
    });
  };

  const columns = useMemo(
    () =>
      createRewardColumns({
        onView: (reward) => setViewingReward(reward),
        onMarkPaid: (reward) => setMarkingPaidReward(reward),
        selectedIds,
        onToggleSelect: toggleSelect,
        allSelected,
        onToggleSelectAll: toggleSelectAll,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedIds, allSelected, rewards],
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedIds(new Set());
  };

  return (
    <div>
      <TableToolbar
        label="Referrals"
        count={total}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search rewards..."
        filterSlot={
          <>
            <DateRangeFilter
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                setCurrentPage(1);
              }}
            />
            <FiltersButton
              activeCount={(statusFilter ? 1 : 0) + (campaignFilter ? 1 : 0)}
            >
              <CustomSelect
                label="Payment"
                value={statusFilter || "All Statuses"}
                options={STATUS_OPTIONS}
                onChange={(val) => {
                  setStatusFilter(val === "All Statuses" ? "" : val);
                  setCurrentPage(1);
                }}
              />
              <CustomSelect
                label="Campaign"
                value={campaignFilter || "All Campaigns"}
                options={campaignOptions}
                onChange={(val) => {
                  setCampaignFilter(val === "All Campaigns" ? "" : val);
                  setCurrentPage(1);
                }}
              />
            </FiltersButton>
            <Button
              leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
              onClick={() => {
                showToast.promise(
                  exportRewards({
                    status: statusFilter ? statusFilter.toLowerCase() : undefined,
                    campaignId: selectedCampaignId,
                    search: debouncedSearch || undefined,
                    startDate: dateRange.from || undefined,
                    endDate: dateRange.to || undefined,
                  }),
                  {
                    loading: "Preparing export...",
                    success: "Export downloaded.",
                    error: "Export failed.",
                  },
                );
              }}
            >
              Export
            </Button>
          </>
        }
      />

      {selectedPendingIds.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2 bg-blue-50 dark:bg-blue-950 rounded-lg mb-2">
          <span className="text-sm text-brand-blue">
            {selectedPendingIds.length} pending reward
            {selectedPendingIds.length === 1 ? "" : "s"} selected
          </span>
          <Button
            leftIcon={<FiCheckCircle className="w-4 h-4 text-white" />}
            bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
            textColor="text-white"
            borderColor="border-transparent"
            onClick={() => setBulkMarkPaidOpen(true)}
          >
            Mark as Paid
          </Button>
        </div>
      )}

      <DataTable
        data={rewards}
        columns={columns}
        query={rewardsQuery}
        emptyMessage="No rewards found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {viewingReward && (
        <ViewRewardModal
          reward={viewingReward}
          onClose={() => setViewingReward(null)}
        />
      )}

      {markingPaidReward && (
        <ConfirmModal
          title="Mark reward as paid"
          message={`Mark the reward for ${markingPaidReward.participant?.name ?? "this participant"} as paid?`}
          confirmLabel="Mark as Paid"
          variant="default"
          isSubmitting={isMarkingPaid}
          onClose={() => setMarkingPaidReward(null)}
          onConfirm={() => {
            showToast.promise(
              markPaid(markingPaidReward._id).then(() =>
                setMarkingPaidReward(null),
              ),
              {
                loading: "Marking reward as paid...",
                success: "Reward marked as paid.",
                error: "Couldn't mark reward as paid.",
              },
            );
          }}
        />
      )}

      {bulkMarkPaidOpen && (
        <ConfirmModal
          title="Mark rewards as paid"
          message={`Mark ${selectedPendingIds.length} selected reward${selectedPendingIds.length === 1 ? "" : "s"} as paid?`}
          confirmLabel="Mark as Paid"
          variant="default"
          isSubmitting={isBulkMarkingPaid}
          onClose={() => setBulkMarkPaidOpen(false)}
          onConfirm={() => {
            showToast.promise(
              bulkMarkPaid({ rewardIds: selectedPendingIds }).then(() => {
                setBulkMarkPaidOpen(false);
                setSelectedIds(new Set());
              }),
              {
                loading: "Marking rewards as paid...",
                success: "Rewards marked as paid.",
                error: "Couldn't mark rewards as paid.",
              },
            );
          }}
        />
      )}
    </div>
  );
}
