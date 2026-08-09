import { useMemo, useState } from "react";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateFilterDropdown from "@/components/generic/DateFilterDropdown";
import FiltersButton from "@/components/generic/FiltersButton";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import { FiChevronDown } from "react-icons/fi";
import type { UserRow } from "../types";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import CustomSelect from "@/components/generic/CustomSelect";
import InviteUserModal from "@/features/users/components/InviteUserModal";
import { createUserColumns } from "./columns";
import SuspendUserModal from "./SuspendUserModal";
import { useNavigate } from "react-router-dom";
import { getYearOptions } from "@/lib/utils/getYearOptions";

const tabs = ["All", "Active", "Suspended", "Banned", "Pending"];
const yearOptions = getYearOptions();

const users: UserRow[] = [
  {
    id: "1",
    name: "Yussuf Ahmed",
    email: "debra.holt@example.com",
    role: "Buyer & Seller",
    listings: 5,
    status: "Active",
    joined: "Apr 6, 2026",
  },
  {
    id: "2",
    name: "Emmanuel Amuneke",
    email: "willie.jennings@example.com",
    role: "Admin",
    listings: 0,
    status: "Active",
    joined: "Apr 6, 2026",
  },
  {
    id: "3",
    name: "Ebubechukwu Agnes",
    email: "bill.sanders@example.com",
    role: "Buyer & Seller",
    listings: 5,
    status: "Pending",
    joined: "Mar 6, 2026",
  },
  {
    id: "4",
    name: "Toluwani Bakare",
    email: "michael.mitc@example.com",
    role: "Buyer & Seller",
    listings: 5,
    status: "Active",
    joined: "Feb 6, 2026",
  },
  {
    id: "5",
    name: "Hannah Pedro",
    email: "sara.cruz@example.com",
    role: "Buyer & Seller",
    listings: 5,
    status: "Suspended",
    joined: "Jan 5, 2026",
  },
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState("");

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [suspendingUser, setSuspendingUser] = useState<UserRow | null>(null);

  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      createUserColumns({
        onSuspend: (user) => setSuspendingUser(user),
        onReactivate: (user) => console.log("reactivate", user.id), // TODO: wire real reactivate flow
        onViewDetails: (user) => navigate(`/users/${user.id}`),
      }),
    [],
  );

  const handleConfirmSuspend = (data: {
    reason: string;
    duration: string;
    outcome: string;
    notes: string;
  }) => {
    // TODO: wire to usersApi.suspendUser once endpoint is confirmed
    console.log("suspending", suspendingUser?.id, data);
    setSuspendingUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesTab = activeTab === "All" || user.status === activeTab;
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage buyer and seller accounts across the platform."
        actions={
          <>
            <Button
              leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
              rightIcon={<FiChevronDown className="w-4 h-4 text-brand-gray-dark" />}
              onClick={() => {
                /* export logic */
              }}
            >
              Export
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

      <TabFilter tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="overflow-hidden">
        <TableToolbar
          label="Users"
          count={filteredUsers.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users..."
          filterSlot={
            <>
              <DateFilterDropdown
                value={year}
                options={yearOptions}
                onChange={setYear}
              />
              <FiltersButton activeCount={role ? 1 : 0}>
                <CustomSelect
                  label="Role"
                  value={role || "All Roles"}
                  options={["All Roles", "Admin", "Buyer & Seller"]}
                  onChange={(val) => setRole(val === "All Roles" ? "" : val)}
                />
              </FiltersButton>
            </>
          }
        />

        <DataTable data={filteredUsers} columns={columns} />

        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* invite user modal */}
      {inviteModalOpen && (
        <InviteUserModal onClose={() => setInviteModalOpen(false)} />
      )}

      {suspendingUser && (
        <SuspendUserModal
          userName={suspendingUser.name}
          onClose={() => setSuspendingUser(null)}
          onConfirm={handleConfirmSuspend}
        />
      )}
    </div>
  );
}
