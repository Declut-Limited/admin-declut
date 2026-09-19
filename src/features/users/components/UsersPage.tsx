import { useMemo, useState, useEffect } from "react";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import FiltersButton from "@/components/generic/FiltersButton";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import CustomSelect from "@/components/generic/CustomSelect";
import ConfirmModal from "@/components/generic/ConfirmModal";
import { createUserColumns } from "./columns";
import SuspendUserModal from "./SuspendUserModal";
import { useNavigate } from "react-router-dom";
import {
  useUsers,
  useExportUsers,
  useSuspendUser,
  useReactivateUser,
  useBanUser,
  useUpdateSubAdminRole,
} from "../queries";
import type { SuspendUserPayload, UserRow } from "../types";
import { showToast } from "@/lib/utils/toast";
import type { DateRange } from "@/components/generic/DateRangeFilter";
import DateRangeFilter from "@/components/generic/DateRangeFilter";
import EditAdminRoleModal from "./EditAdminRoleModal";
import { usePageSize } from "@/lib/hooks/usePageSize";

const tabs = ["All", "Active", "Suspended", "Pending", "Banned", "Deactivated"];

export default function UsersPage() {
  const PAGE_SIZE = usePageSize();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [accountType, setAccountType] = useState("");

  const [suspendingUser, setSuspendingUser] = useState<UserRow | null>(null);
  const [banningUser, setBanningUser] = useState<UserRow | null>(null);

  const navigate = useNavigate();

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
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleTypeChange = (val: string) => {
    setAccountType(val === "All Types" ? "" : val);
    setCurrentPage(1);
  };

  const usersQuery = useUsers({
    page: currentPage,
    limit: PAGE_SIZE,
    status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
    type: accountType
      ? (accountType.toLowerCase() as "user" | "admin")
      : undefined,
    search: debouncedSearch || undefined,
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });

  const { data } = usersQuery;

  const { mutateAsync: exportUsers, isPending: isExporting } = useExportUsers();
  const { mutateAsync: suspendUser, isPending: isSuspending } =
    useSuspendUser();
  const { mutateAsync: reactivateUser } = useReactivateUser();
  const { mutateAsync: banUser, isPending: isBanning } = useBanUser();
  const [editingAdmin, setEditingAdmin] = useState<UserRow | null>(null);
  const { mutateAsync: updateSubAdminRole, isPending: isUpdatingRole } =
    useUpdateSubAdminRole();

  const users = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const columns = useMemo(
    () =>
      createUserColumns({
        onSuspend: (user) => setSuspendingUser(user),
        onReactivate: (user) => {
          showToast.promise(reactivateUser(user._id), {
            loading: `Reactivating ${user.name}...`,
            success: `${user.name} can now access their account.`,
            error: "Couldn't reactivate user.",
          });
        },
        onEdit: (user) => {
          if (user.type !== "admin") {
            showToast.info("Not editable", {
              description: "Only admin accounts have an assignable role.",
            });
            return;
          }
          setEditingAdmin(user);
        },
        onBan: (user) => setBanningUser(user),
        onViewDetails: (user) => navigate(`/users/${user._id}`),
      }),
    [navigate, reactivateUser],
  );

  const handleConfirmBan = () => {
    if (!banningUser) return;

    showToast.promise(
      banUser(banningUser._id).then(() => setBanningUser(null)),
      {
        loading: `Banning ${banningUser.name}...`,
        success: `${banningUser.name} has been banned.`,
        error: "Couldn't ban user.",
      },
    );
  };

  const handleConfirmSuspend = (payload: SuspendUserPayload) => {
    if (!suspendingUser) return;

    showToast.promise(
      suspendUser({ userId: suspendingUser._id, payload }).then(() =>
        setSuspendingUser(null),
      ),
      {
        loading: `Suspending ${suspendingUser.name}...`,
        success: `${suspendingUser.name} has been suspended.`,
        error: "Couldn't suspend user.",
      },
    );
  };

  const handleExport = () => {
    showToast.promise(
      exportUsers({
        status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
        type: accountType
          ? (accountType.toLowerCase() as "user" | "admin")
          : undefined,
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
  };

  const handleConfirmRoleChange = (roleId: string) => {
    if (!editingAdmin) return;

    showToast.promise(
      updateSubAdminRole({
        subAdminId: editingAdmin._id,
        payload: { roleId },
      }).then(() => setEditingAdmin(null)),
      {
        loading: `Updating ${editingAdmin.name}'s role...`,
        success: `${editingAdmin.name}'s role has been updated.`,
        error: "Couldn't update role.",
      },
    );
  };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage buyer and seller accounts across the platform."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <div>
        <TableToolbar
          label="Users"
          count={total}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users..."
          filterSlot={
            <>
              <DateRangeFilter
                value={dateRange}
                onChange={handleDateRangeChange}
              />
              <FiltersButton activeCount={accountType ? 1 : 0}>
                <CustomSelect
                  label="Account Type"
                  value={accountType || "All Types"}
                  options={["All Types", "User", "Admin"]}
                  onChange={handleTypeChange}
                />
              </FiltersButton>
            </>
          }
        />

        <DataTable
          data={users}
          columns={columns}
          query={usersQuery}
          emptyMessage="No users found."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {suspendingUser && (
        <SuspendUserModal
          userName={suspendingUser.name}
          isSubmitting={isSuspending}
          onClose={() => setSuspendingUser(null)}
          onConfirm={handleConfirmSuspend}
        />
      )}

      {editingAdmin && (
        <EditAdminRoleModal
          adminName={editingAdmin.name}
          currentRoleId={editingAdmin.roleId}
          isSubmitting={isUpdatingRole}
          onClose={() => setEditingAdmin(null)}
          onConfirm={handleConfirmRoleChange}
        />
      )}

      {banningUser && (
        <ConfirmModal
          title={`Ban ${banningUser.name}`}
          message={`This will permanently ban ${banningUser.name} and block them from accessing their account. This action cannot be undone.`}
          confirmLabel="Ban User"
          variant="danger"
          isSubmitting={isBanning}
          onClose={() => setBanningUser(null)}
          onConfirm={handleConfirmBan}
        />
      )}
    </div>
  );
}
