import { useMemo, useState, useEffect } from "react";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import FiltersButton from "@/components/generic/FiltersButton";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import CustomSelect from "@/components/generic/CustomSelect";
import InviteUserModal from "@/features/users/components/InviteUserModal";
import { createUserColumns } from "./columns";
import SuspendUserModal from "./SuspendUserModal";
import { useNavigate } from "react-router-dom";
import {
  useUsers,
  useExportUsers,
  useSuspendUser,
  useReactivateUser,
} from "../queries";
import type { SuspendUserPayload, UserRow } from "../types";
import { showToast } from "@/lib/utils/toast";
import type { DateRange } from "@/components/generic/DateRangeFilter";
import DateRangeFilter from "@/components/generic/DateRangeFilter";
import { PAGE_SIZE } from "@/lib/constants/pagination";

const tabs = ["All", "Active", "Suspended", "Pending"];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [role, setRole] = useState("");

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [suspendingUser, setSuspendingUser] = useState<UserRow | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setDateRange({ from: "", to: "" });
    setRole("");
  };

  const { data, isLoading } = useUsers({
    page: currentPage,
    limit: PAGE_SIZE,
    status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
    search: debouncedSearch || undefined,
  });

  const { mutateAsync: exportUsers, isPending: isExporting } = useExportUsers();
  const { mutateAsync: suspendUser, isPending: isSuspending } =
    useSuspendUser();
  const { mutateAsync: reactivateUser } = useReactivateUser();

  const users = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const columns = useMemo(
    () =>
      createUserColumns({
        onSuspend: (user) => setSuspendingUser(user),
        onReactivate: (user) => {
          showToast.promise(reactivateUser(user.id), {
            loading: `Reactivating ${user.name}...`,
            success: `${user.name} can now access their account.`,
            error: "Couldn't reactivate user.",
          });
        },
        onViewDetails: (user) => navigate(`/users/${user.id}`),
      }),
    [navigate, reactivateUser],
  );

  const handleConfirmSuspend = (payload: SuspendUserPayload) => {
    if (!suspendingUser) return;

    showToast.promise(
      suspendUser({ userId: suspendingUser.id, payload }).then(() =>
        setSuspendingUser(null),
      ),
      {
        loading: `Suspending ${suspendingUser.name}...`,
        success: `${suspendingUser.name} has been suspended.`,
        error: "Couldn't suspend user.",
      },
    );
  };

  const visibleUsers = useMemo(() => {
    return users.filter((user) => {
      if (role && user.role !== role) return false;

      if (dateRange.from || dateRange.to) {
        const joined = new Date(user.joinedAt).getTime();
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
      }

      return true;
    });
  }, [users, role, dateRange]);

  const activeFilterCount =
    (role ? 1 : 0) + (dateRange.from || dateRange.to ? 1 : 0);

  const handleExport = () => {
    showToast.promise(
      exportUsers({
        status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
        search: debouncedSearch || undefined,
      }),
      {
        loading: "Preparing export...",
        success: "Export downloaded.",
        error: "Export failed.",
      },
    );
  };
  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage buyer and seller accounts across the platform."
        actions={
          <>
            <Button
              leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? "Exporting..." : "Export"}
            </Button>

            <Button
              leftIcon={<FaCirclePlus className="w-4 h-4 text-[#FFFFFF]" />}
              bgColor="bg-[#2563EB] hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              onClick={() => setInviteModalOpen(true)}
            >
              Invite User
            </Button>
          </>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <div>
        <TableToolbar
          label="Users"
          count={activeFilterCount > 0 ? visibleUsers.length : total}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users..."
          filterSlot={
            <>
              <DateRangeFilter value={dateRange} onChange={setDateRange} />
              <FiltersButton activeCount={role ? 1 : 0}>
                <CustomSelect
                  label="Role"
                  value={role || "All Roles"}
                  options={["All Roles", "Admin", "User"]}
                  onChange={(val) => setRole(val === "All Roles" ? "" : val)}
                />
              </FiltersButton>
            </>
          }
        />

        <DataTable
          data={visibleUsers}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No users found."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {inviteModalOpen && (
        <InviteUserModal onClose={() => setInviteModalOpen(false)} />
      )}
      {suspendingUser && (
        <SuspendUserModal
          userName={suspendingUser.name}
          isSubmitting={isSuspending}
          onClose={() => setSuspendingUser(null)}
          onConfirm={handleConfirmSuspend}
        />
      )}
    </div>
  );
}
