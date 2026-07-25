import { useState } from "react";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateFilterDropdown from "@/components/generic/DateFilterDropdown";
import FiltersButton from "@/components/generic/FiltersButton";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import { FiChevronDown } from "react-icons/fi";
import { userColumns } from "./columns";
import type { UserRow } from "../types";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { FaCirclePlus } from "react-icons/fa6";
import CustomSelect from "@/components/generic/CustomSelect";

const tabs = ["All", "Active", "Suspended", "Banned", "Pending"];
const yearOptions = ["2024", "2025", "2026"];

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
              rightIcon={<FiChevronDown className="w-4 h-4 text-[#475467]" />}
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
              onClick={() => {
                /* invite user logic */
              }}
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

        <DataTable data={filteredUsers} columns={userColumns} />

        <Pagination
          currentPage={currentPage}
          totalPages={10}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
