/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import type { Participant } from "../types";
import { createParticipantColumns } from "./participantColumns";

// TODO: replace with /admin/referrals/participants once available
const mockParticipants: Participant[] = [
  { id: "1", name: "Amara Okoro", campaignName: "August Marketplace Boost", referredUsers: 6, qualified: 3, ownTransactions: "2/2", progress: 100, deadline: "2026-09-30", reward: 10000, status: "qualified" },
  { id: "2", name: "Tunde Adebayo", campaignName: "Verified Seller Drive", referredUsers: 4, qualified: 2, ownTransactions: "2/2", progress: 100, deadline: "2026-08-31", reward: 5000, status: "approved" },
  { id: "3", name: "Bisi Alade", campaignName: "Lagos New User Launch", referredUsers: 2, qualified: 1, ownTransactions: "1/2", progress: 45, deadline: "2026-10-31", reward: 3000, status: "expired" },
  { id: "4", name: "Ibrahim Sani", campaignName: "June Referral Sprint", referredUsers: 3, qualified: 1, ownTransactions: "0/2", progress: 60, deadline: "2026-06-30", reward: 2000, status: "in_progress" },
];

export default function ParticipantsTab() {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const participants = mockParticipants;

  const columns = useMemo(
    () =>
      createParticipantColumns({
        onViewDetails: (participant: any) =>
          navigate(`/referrals/participants/${participant.id}`),
      }),
    [navigate],
  );

  const visibleParticipants = useMemo(() => {
    return participants.filter((participant) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        participant.name.toLowerCase().includes(q) ||
        participant.campaignName.toLowerCase().includes(q);

      const matchesStatus =
        !statusFilter ||
        participant.status === statusFilter.toLowerCase().replace(/\s/g, "_");

      let matchesDate = true;
      if (dateRange.from || dateRange.to) {
        const deadline = new Date(participant.deadline).getTime();
        if (Number.isNaN(deadline)) matchesDate = false;
        else {
          if (
            dateRange.from &&
            deadline < new Date(dateRange.from).setHours(0, 0, 0, 0)
          )
            matchesDate = false;
          if (
            dateRange.to &&
            deadline > new Date(dateRange.to).setHours(23, 59, 59, 999)
          )
            matchesDate = false;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [participants, search, statusFilter, dateRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(visibleParticipants.length / PAGE_SIZE),
  );

  const paginatedParticipants = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return visibleParticipants.slice(start, start + PAGE_SIZE);
  }, [visibleParticipants, currentPage]);

  return (
    <div>
      <TableToolbar
        label="Participants"
        count={visibleParticipants.length}
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
            <FiltersButton activeCount={statusFilter ? 1 : 0}>
              <CustomSelect
                label="Status"
                value={statusFilter || "All Statuses"}
                options={[
                  "All Statuses",
                  "Qualified",
                  "Approved",
                  "In Progress",
                  "Expired",
                  "Disqualified",
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
        data={paginatedParticipants}
        columns={columns}
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