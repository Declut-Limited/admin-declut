import { useMemo, useState, useEffect } from "react";
import PageHeader from "@/components/generic/PageHeader";
import TableToolbar from "@/components/generic/TableToolbar";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import Button from "@/components/generic/Button";
import ConfirmModal from "@/components/generic/ConfirmModal";
import Skeleton from "@/components/generic/Skeleton";
import InviteUsersModal from "./InviteUsersModal";
import { PiExportFill } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import { createWaitlistColumns } from "./columns";
import { showToast } from "@/lib/utils/toast";
import {
  useWaitlist,
  useWaitlistInsights,
  useRemoveWaitlistUser,
  useInviteWaitlistUser,
  useBulkInviteWaitlist,
  useExportWaitlist,
} from "../queries";
import type { WaitlistUser, BulkInvitePayload } from "../types";
import clockIcon from "@/assets/icons/clock.svg";
import userAddIcon from "@/assets/icons/profile-add-grey.svg";
import usersIcon from "@/assets/icons/profile-tick.svg";
import profile from "@/assets/icons/profile.svg";
import walletAdd from "@/assets/icons/wallet-add.svg";
import wallet from "@/assets/icons/wallet.svg";
import { usePageSize } from "@/lib/hooks/usePageSize";

const DEFAULT_INVITE_MESSAGE =
  "You're one of the first people we're inviting to try Declut — tap below to claim your spot.";

export default function WaitlistPage() {
  const PAGE_SIZE = usePageSize();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [statusFilter, setStatusFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removingUser, setRemovingUser] = useState<WaitlistUser | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: insights, isLoading: insightsLoading } = useWaitlistInsights();

  const waitlistQuery = useWaitlist({
    page: currentPage,
    limit: PAGE_SIZE,
    status: statusFilter ? statusFilter.toLowerCase() : undefined,
    interest: interestFilter ? interestFilter.toLowerCase() : undefined,
    search: debouncedSearch || undefined,
  });

  const { data } = waitlistQuery;

  const { mutateAsync: removeUser, isPending: isRemoving } =
    useRemoveWaitlistUser();
  const { mutateAsync: inviteUser } = useInviteWaitlistUser();
  const { mutateAsync: bulkInvite, isPending: isInviting } =
    useBulkInviteWaitlist();
  const { mutateAsync: exportWaitlist } = useExportWaitlist();

  const handleExport = () => {
    showToast.promise(
      exportWaitlist({
        status: statusFilter ? statusFilter.toLowerCase() : undefined,
        interest: interestFilter ? interestFilter.toLowerCase() : undefined,
        search: debouncedSearch || undefined,
      }),
      {
        loading: "Preparing export...",
        success: "Export downloaded.",
        error: "Export failed.",
      },
    );
  };

  const users = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const statCards = insights
    ? [
        {
          label: "Waiting",
          value: insights.waiting.toLocaleString(),
          icon: clockIcon,
        },
        {
          label: "Invited",
          value: insights.invited.toLocaleString(),
          icon: userAddIcon,
        },
        {
          label: "Joined",
          value: insights.joined.toLocaleString(),
          icon: usersIcon,
        },
        {
          label: "Buyer Interest",
          value: insights.buyerInterest,
          icon: profile,
        },
        {
          label: "Seller Interest",
          value: insights.sellerInterest,
          icon: walletAdd,
        },
        {
          label: "Both",
          value: insights.bothBuyerAndSellerInterest,
          icon: wallet,
        },
      ]
    : [];

  const columns = useMemo(
    () =>
      createWaitlistColumns({
        onSendInvite: (user) => {
          showToast.promise(
            inviteUser({
              waitlistId: user._id,
              payload: {
                email: user.email,
                message: DEFAULT_INVITE_MESSAGE,
              },
            }),
            {
              loading: `Inviting ${user.email}...`,
              success: `An invitation was sent to ${user.email}.`,
              error: "Couldn't send invite.",
            },
          );
        },
        onCopyEmail: (user) => {
          navigator.clipboard.writeText(user.email);
          showToast.success("Email copied", { description: user.email });
        },
        onRemove: (user) => setRemovingUser(user),
      }),
    [inviteUser],
  );

  const visibleUsers = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return users;

    return users.filter((user) => {
      const joined = new Date(user.createdAt).getTime();
      if (Number.isNaN(joined)) return false;
      if (
        dateRange.from &&
        joined < new Date(dateRange.from).setHours(0, 0, 0, 0)
      )
        return false;
      if (
        dateRange.to &&
        joined > new Date(dateRange.to).setHours(23, 59, 59, 999)
      )
        return false;
      return true;
    });
  }, [users, dateRange]);

  const activeFilterCount = (statusFilter ? 1 : 0) + (interestFilter ? 1 : 0);

  const handleInvite = (payload: BulkInvitePayload) => {
    showToast.promise(
      bulkInvite(payload).then(() => setInviteModalOpen(false)),
      {
        loading: `Inviting ${payload.recipients.length} users...`,
        success: `${payload.recipients.length} waitlist users were invited.`,
        error: "Couldn't send invitations.",
      },
    );
  };

  return (
    <div>
      <PageHeader
        title="Waitlist"
        subtitle="View and manage everyone who has joined the Declut waitlist and track their invitation status."
        actions={
          <>
            <Button
              leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
              onClick={handleExport}
            >
              Export
            </Button>
            <Button
              leftIcon={<FaCirclePlus className="w-4 h-4 text-white" />}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              onClick={() => setInviteModalOpen(true)}
            >
              Invite Users
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {insightsLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="waitlist-stat-card">
                <Skeleton className="h-7 w-16 mb-2" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))
          : statCards.map((stat) => (
              <div key={stat.label} className="waitlist-stat-card">
                <p className="waitlist-stat-value">{stat.value}</p>
                <p className="waitlist-stat-label">
                  <img src={stat.icon} alt="" className="w-4 h-4" />
                  {stat.label}
                </p>
              </div>
            ))}
      </div>

      <TableToolbar
        label="Waitlist Users"
        count={total}
        searchValue={search}
        onSearchChange={setSearch}
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
            <FiltersButton activeCount={activeFilterCount}>
              <div className="flex flex-col gap-4">
                <CustomSelect
                  label="Status"
                  value={statusFilter || "All Statuses"}
                  options={[
                    "All Statuses",
                    "Waiting",
                    "Invited",
                    "Joined",
                    "Unsubscribed",
                  ]}
                  onChange={(val) => {
                    setStatusFilter(val === "All Statuses" ? "" : val);
                    setCurrentPage(1);
                  }}
                />
                <CustomSelect
                  label="Interest"
                  value={interestFilter || "All Interests"}
                  options={["All Interests", "Buying", "Selling", "Both"]}
                  onChange={(val) => {
                    setInterestFilter(val === "All Interests" ? "" : val);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </FiltersButton>
          </>
        }
      />

      <DataTable
        data={visibleUsers}
        columns={columns}
        query={waitlistQuery}
        emptyMessage="No waitlist users found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {inviteModalOpen && (
        <InviteUsersModal
          isSubmitting={isInviting}
          onClose={() => setInviteModalOpen(false)}
          onConfirm={handleInvite}
        />
      )}

      {removingUser && (
        <ConfirmModal
          title="Remove from waitlist"
          message={`Remove ${removingUser.email} from the waitlist? This can't be undone.`}
          confirmLabel="Remove"
          isSubmitting={isRemoving}
          onClose={() => setRemovingUser(null)}
          onConfirm={() => {
            showToast.promise(
              removeUser(removingUser._id).then(() => setRemovingUser(null)),
              {
                loading: `Removing ${removingUser.email}...`,
                success: `${removingUser.email} has been removed.`,
                error: "Couldn't remove user.",
              },
            );
          }}
        />
      )}
    </div>
  );
}
