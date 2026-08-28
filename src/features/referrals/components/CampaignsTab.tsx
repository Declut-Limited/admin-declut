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
import { createCampaignColumns } from "./campaignColumns";
import ViewCampaignModal from "./ViewCampaignModal";
import CreateCampaignModal from "./CreateCampaignModal";
import { showToast } from "@/lib/utils/toast";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import type { Campaign } from "../types";

// TODO: replace with /admin/referrals/campaigns once available
const mockCampaigns: Campaign[] = [
  { id: "1", code: "CMP-024", name: "August Marketplace Boost", reward: 10000, from: "2026-08-01", to: "2026-09-30", requirement: "2 successful referrals", participants: 428, qualified: 94, paid: 71, status: "active", createdBy: "Idowu Olatunji" },
  { id: "2", code: "CMP-023", name: "Verified Seller Drive", reward: 5000, from: "2026-07-15", to: "2026-08-31", requirement: "3 completed sales", participants: 216, qualified: 58, paid: 44, status: "active", createdBy: "Idowu Olatunji" },
  { id: "3", code: "CMP-022", name: "Lagos New User Launch", reward: 3000, from: "2026-09-01", to: "2026-10-31", requirement: "2 completed transactions", participants: 0, qualified: 0, paid: 0, status: "scheduled", createdBy: "Idowu Olatunji" },
  { id: "4", code: "CMP-021", name: "June Referral Sprint", reward: 2000, from: "2026-06-01", to: "2026-06-30", requirement: "2 successful referrals", participants: 189, qualified: 47, paid: 47, status: "ended", createdBy: "Idowu Olatunji" },
];

export default function CampaignsTab() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [endingCampaign, setEndingCampaign] = useState<Campaign | null>(null);
  const [archivingCampaign, setArchivingCampaign] = useState<Campaign | null>(null);

  const campaigns = mockCampaigns;

  const columns = useMemo(
    () =>
      createCampaignColumns({
        onViewDetails: (campaign) => setViewingCampaign(campaign),
        onEdit: (campaign) => setEditingCampaign(campaign),
        onDuplicate: (campaign) => {
          // TODO: wire duplicate endpoint
          showToast.success("Campaign duplicated", {
            description: `A copy of ${campaign.name} was created as a draft.`,
          });
        },
        onPause: (campaign) => {
          // TODO: wire pause endpoint
          showToast.success("Campaign paused", {
            description: `${campaign.name} is now paused.`,
          });
        },
        onArchive: (campaign) => setArchivingCampaign(campaign),
        onEnd: (campaign) => setEndingCampaign(campaign),
      }),
    [],
  );

  const visibleCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        campaign.name.toLowerCase().includes(q) ||
        campaign.createdBy.toLowerCase().includes(q);

      const matchesStatus =
        !statusFilter || campaign.status === statusFilter.toLowerCase();

      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const from = new Date(campaign.from).getTime();
        if (Number.isNaN(from)) matchesDate = false;
        else {
          if (dateRange.from && from < new Date(dateRange.from).setHours(0, 0, 0, 0))
            matchesDate = false;
          if (dateRange.to && from > new Date(dateRange.to).setHours(23, 59, 59, 999))
            matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [campaigns, search, statusFilter, dateRange]);

  const totalPages = Math.max(1, Math.ceil(visibleCampaigns.length / PAGE_SIZE));

  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleCampaigns.slice(start, start + PAGE_SIZE);
  }, [visibleCampaigns, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <TableToolbar
        label="Programmes"
        count={visibleCampaigns.length}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search campaigns..."
        filterSlot={
          <>
            <DateRangeFilter
              value={dateRange}
              onChange={(range) => {
                setDateRange(range);
                setCurrentPage(1);
              }}
            />
            <FiltersButton activeCount={statusFilter ? 1 : 0}>
              <CustomSelect
                label="Status"
                value={statusFilter || "All Statuses"}
                options={[
                  "All Statuses",
                  "Active",
                  "Scheduled",
                  "Paused",
                  "Ended",
                  "Draft",
                  "Archived",
                ]}
                onChange={(val) => {
                  setStatusFilter(val === "All Statuses" ? "" : val);
                  setCurrentPage(1);
                }}
              />
            </FiltersButton>
          </>
        }
      />

      <DataTable
        data={paginatedCampaigns}
        columns={columns}
        emptyMessage="No campaigns found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {viewingCampaign && (
        <ViewCampaignModal
          campaign={viewingCampaign}
          onClose={() => setViewingCampaign(null)}
        />
      )}

      {editingCampaign && (
        <CreateCampaignModal onClose={() => setEditingCampaign(null)} />
      )}

      {endingCampaign && (
        <ConfirmModal
          title="End campaign"
          message={`End ${endingCampaign.name}? Participants can no longer qualify once it ends.`}
          confirmLabel="End Campaign"
          onClose={() => setEndingCampaign(null)}
          onConfirm={() => {
            // TODO: wire end endpoint
            showToast.success("Campaign ended", {
              description: `${endingCampaign.name} has ended.`,
            });
            setEndingCampaign(null);
          }}
        />
      )}

      {archivingCampaign && (
        <ConfirmModal
          title="Archive campaign"
          message={`Archive ${archivingCampaign.name}? It will be hidden from the active list.`}
          confirmLabel="Archive"
          onClose={() => setArchivingCampaign(null)}
          onConfirm={() => {
            // TODO: wire archive endpoint
            showToast.success("Campaign archived", {
              description: `${archivingCampaign.name} has been archived.`,
            });
            setArchivingCampaign(null);
          }}
        />
      )}
    </div>
  );
}