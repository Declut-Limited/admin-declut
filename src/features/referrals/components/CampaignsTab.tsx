import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
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
import { getApiErrorMessage } from "@/lib/utils/getApiErrorMessage";
import { usePageSize } from "@/lib/hooks/usePageSize";
import { getReferralCampaign } from "../api";
import {
  useReferralCampaigns,
  useUpdateReferralCampaign,
  useDuplicateReferralCampaign,
  useArchiveReferralCampaign,
  useExportReferralCampaigns,
} from "../queries";
import type { ReferralCampaign, ReferralCampaignListItem } from "../types";

const STATUS_OPTIONS = ["All Statuses", "Draft", "Published", "Scheduled", "Ended"];

export default function CampaignsTab() {
  const PAGE_SIZE = usePageSize();

  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewingCampaignId, setViewingCampaignId] = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<{
    _id: string;
    name: string;
  } | null>(null);
  const [endingCampaign, setEndingCampaign] =
    useState<ReferralCampaignListItem | null>(null);
  const [archivingCampaign, setArchivingCampaign] =
    useState<ReferralCampaignListItem | null>(null);
  const [isEnding, setIsEnding] = useState(false);

  const queryClient = useQueryClient();

  const campaignsQuery = useReferralCampaigns({
    page: currentPage,
    limit: PAGE_SIZE,
    status: statusFilter ? statusFilter.toLowerCase() : undefined,
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });

  const { data } = campaignsQuery;
  const { mutateAsync: updateCampaign, isPending: isUpdating } =
    useUpdateReferralCampaign();
  const { mutateAsync: duplicateCampaign } = useDuplicateReferralCampaign();
  const { mutateAsync: archiveCampaign, isPending: isArchiving } =
    useArchiveReferralCampaign();
  const { mutateAsync: exportCampaigns } = useExportReferralCampaigns();

  const campaigns = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns = useMemo(
    () =>
      createCampaignColumns({
        onViewDetails: (campaign) => setViewingCampaignId(campaign._id),
        onEdit: (campaign) => setEditingCampaign(campaign),
        onDuplicate: (campaign) => {
          showToast.promise(
            duplicateCampaign(campaign._id).then((res) => {
              setViewingCampaignId(res.data._id);
            }),
            {
              loading: `Duplicating ${campaign.name}...`,
              success: "Campaign duplicated.",
              error: "Couldn't duplicate campaign.",
            },
          );
        },
        onPause: (campaign) => {
          // TODO: no pause endpoint yet
          showToast.success("Campaign paused", {
            description: `${campaign.name} is now paused.`,
          });
        },
        onArchive: (campaign) => setArchivingCampaign(campaign),
        onEnd: (campaign) => setEndingCampaign(campaign),
      }),
    [duplicateCampaign],
  );

  // no search param on the endpoint — filtering the current page
  const filteredCampaigns = useMemo(() => {
    if (!search) return campaigns;
    const q = search.toLowerCase();
    return campaigns.filter(
      (campaign) =>
        campaign.name.toLowerCase().includes(q) ||
        campaign.createdBy.toLowerCase().includes(q),
    );
  }, [campaigns, search]);

  const isFiltering = Boolean(search);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  return (
    <div>
      <TableToolbar
        label="Programmes"
        count={isFiltering ? filteredCampaigns.length : total}
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
                options={STATUS_OPTIONS}
                onChange={(val) => {
                  setStatusFilter(val === "All Statuses" ? "" : val);
                  setCurrentPage(1);
                }}
              />
            </FiltersButton>
            <Button
              leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
              onClick={() => {
                showToast.promise(
                  exportCampaigns({
                    status: statusFilter ? statusFilter.toLowerCase() : undefined,
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

      <DataTable
        data={filteredCampaigns}
        columns={columns}
        query={campaignsQuery}
        emptyMessage="No campaigns found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {viewingCampaignId && (
        <ViewCampaignModal
          campaignId={viewingCampaignId}
          onClose={() => setViewingCampaignId(null)}
          onEdit={(campaign) => {
            setViewingCampaignId(null);
            setEditingCampaign({ _id: campaign._id, name: campaign.name });
          }}
        />
      )}

      {editingCampaign && (
        <CreateCampaignModal
          campaignId={editingCampaign._id}
          isSubmitting={isUpdating}
          onClose={() => setEditingCampaign(null)}
          onSubmit={(payload) => {
            showToast.promise(
              updateCampaign({
                campaignId: editingCampaign._id,
                payload,
              }).then(() => setEditingCampaign(null)),
              {
                loading: `Updating ${editingCampaign.name}...`,
                success: "Campaign updated.",
                error: "Couldn't update campaign.",
              },
            );
          }}
        />
      )}

      {endingCampaign && (
        <ConfirmModal
          title="End campaign"
          message={`End ${endingCampaign.name}? Participants can no longer qualify once it ends.`}
          confirmLabel="End Campaign"
          isSubmitting={isEnding || isUpdating}
          onClose={() => setEndingCampaign(null)}
          onConfirm={async () => {
            const campaignId = endingCampaign._id;
            const campaignName = endingCampaign.name;
            setIsEnding(true);
            try {
              const detail = await queryClient.fetchQuery({
                queryKey: ["referral-campaigns", campaignId],
                queryFn: () => getReferralCampaign(campaignId),
              });
              await showToast.promise(
                updateCampaign({
                  campaignId,
                  payload: { ...toPayload(detail.data), status: "ended" },
                }).then(() => setEndingCampaign(null)),
                {
                  loading: `Ending ${campaignName}...`,
                  success: `${campaignName} has ended.`,
                  error: "Couldn't end campaign.",
                },
              );
            } catch (err) {
              showToast.error("Couldn't end campaign.", {
                description: getApiErrorMessage(err),
              });
            } finally {
              setIsEnding(false);
            }
          }}
        />
      )}

      {archivingCampaign && (
        <ConfirmModal
          title="Archive campaign"
          message={`Archive ${archivingCampaign.name}? It will be hidden from the active list.`}
          confirmLabel="Archive"
          isSubmitting={isArchiving}
          onClose={() => setArchivingCampaign(null)}
          onConfirm={() => {
            showToast.promise(
              archiveCampaign(archivingCampaign._id).then(() =>
                setArchivingCampaign(null),
              ),
              {
                loading: `Archiving ${archivingCampaign.name}...`,
                success: `${archivingCampaign.name} has been archived.`,
                error: "Couldn't archive campaign.",
              },
            );
          }}
        />
      )}
    </div>
  );
}


function toPayload(campaign: ReferralCampaign) {
  return {
    name: campaign.name,
    description: campaign.description,
    internalCampaignCode: campaign.internalCampaignCode,
    status: campaign.status,
    startDate: campaign.startDate,
    endDate: campaign.endDate,
    rewardType: campaign.rewardType,
    rewardAmount: campaign.rewardAmount,
    maxCampaignBudget: campaign.maxCampaignBudget,
    referralRequirement: campaign.referralRequirement,
    qualificationWindow: campaign.qualificationWindow,
    eligibility: campaign.eligibility,
    validationRules: campaign.validationRules,
    paymentMethod: campaign.paymentMethod,
    paymentSchedule: campaign.paymentSchedule,
  };
}
