import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { showToast } from "@/lib/utils/toast";
import { usePageSize } from "@/lib/hooks/usePageSize";
import {
  useReferralCampaigns,
  useReferralParticipants,
  useExportReferralParticipants,
} from "../queries";
import { createParticipantColumns } from "./participantColumns";

const STATUS_OPTIONS = [
  "All Statuses",
  "In Progress",
  "Qualified",
  "Paid",
  "Disqualified",
  "Expired",
  "Left",
];

export default function ParticipantsTab() {
  const PAGE_SIZE = usePageSize();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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

  const participantsQuery = useReferralParticipants({
    page: currentPage,
    limit: PAGE_SIZE,
    status: statusFilter
      ? statusFilter.toLowerCase().replace(/\s+/g, "_")
      : undefined,
    campaignId: selectedCampaignId,
    search: debouncedSearch || undefined,
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });

  const { data } = participantsQuery;
  const participants = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const { mutateAsync: exportParticipants } = useExportReferralParticipants();

  const columns = useMemo(
    () =>
      createParticipantColumns({
        onViewDetails: (participant) =>
          navigate(`/referrals/participants/${participant._id}`),
      }),
    [navigate],
  );

  return (
    <div>
      <TableToolbar
        label="Participants"
        count={total}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search participants or campaigns..."
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
                label="Status"
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
                  exportParticipants({
                    status: statusFilter
                      ? statusFilter.toLowerCase().replace(/\s+/g, "_")
                      : undefined,
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

      <DataTable
        data={participants}
        columns={columns}
        query={participantsQuery}
        emptyMessage="No participants found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
