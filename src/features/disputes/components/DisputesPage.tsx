import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateFilterDropdown from "@/components/generic/DateFilterDropdown";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
import { FiChevronDown } from "react-icons/fi";
import { getYearOptions } from "@/lib/utils/getYearOptions";
import { createDisputeColumns } from "./columns";
import type { DisputeRow } from "../types";


const tabs = ["All", "New", "Investigating", "Resolved"];
const yearOptions = getYearOptions();

const disputes: DisputeRow[] = [
  { id: "1", reportCode: "RPT-001", target: "shoes", reporterName: "Ebubechukwu Agnes", reason: "Item not received as described.", status: "Resolved", joined: "Apr 6, 2026" },
  { id: "2", reportCode: "RPT-002", target: "shirt", reporterName: "Jicholia Oyebola", reason: "Payment not processed.", status: "Investigating", joined: "Apr 6, 2026" },
  { id: "3", reportCode: "RPT-003", target: "t-shirt", reporterName: "Ogunmodede-Smart Olusegun", reason: "Seller failed to ship the item.", status: "Dismissed", joined: "Mar 6, 2026" },
  { id: "4", reportCode: "RPT-004", target: "jacket", reporterName: "Emmanuel Amuneke", reason: "Buyer did not receive the correct item.", status: "Investigating", joined: "Feb 6, 2026" },
  { id: "5", reportCode: "RPT-005", target: "t-shirt", reporterName: "Oyebamiji Oluwasola", reason: "Item was damaged during shipping.", status: "Dismissed", joined: "Jan 5, 2026" },
  { id: "6", reportCode: "RPT-006", target: "shoes", reporterName: "Boluwatife Olusola", reason: "Buyer changed their mind after purchase.", status: "New", joined: "Feb 6, 2026" },
  { id: "7", reportCode: "RPT-007", target: "jacket", reporterName: "Josh Michael", reason: "Seller did not respond to inquiries.", status: "Investigating", joined: "Jan 5, 2026" },
  { id: "8", reportCode: "RPT-008", target: "pants", reporterName: "Solomon Ideh", reason: "Suspected scam", status: "Resolved", joined: "Feb 6, 2026" },
];

export default function DisputesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      createDisputeColumns({
        onViewDetails: (dispute) => navigate(`/disputes/${dispute.reportCode}`),
        onDismiss: (dispute) => console.log("dismiss", dispute.id), // TODO: wire dismiss flow
        onResolve: (dispute) => console.log("resolve", dispute.id), // TODO: wire resolve flow
        onRemoveListing: (dispute) => console.log("remove listing", dispute.id), // TODO: wire remove flow / confirm modal
      }),
    [],
  );

  const filteredDisputes = disputes.filter((dispute) => {
    const matchesTab = activeTab === "All" || dispute.status === activeTab;
    const matchesSearch =
      dispute.reporterName.toLowerCase().includes(search.toLowerCase()) ||
      dispute.reportCode.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Disputes"
        subtitle="Handle listings and users flagged by the community."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            rightIcon={<FiChevronDown className="w-4 h-4 text-brand-gray-dark" />}
            onClick={() => {
              /* export logic */
            }}
          >
            Export
          </Button>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="overflow-hidden">
        <TableToolbar
          label="Disputes"
          count={filteredDisputes.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search users..."
          filterSlot={
            <>
              <DateFilterDropdown value={year} options={yearOptions} onChange={setYear} />
              <FiltersButton activeCount={statusFilter ? 1 : 0}>
                <CustomSelect
                  label="Status"
                  value={statusFilter || "All Statuses"}
                  options={["All Statuses", "New", "Investigating", "Dismissed", "Resolved"]}
                  onChange={(val) => setStatusFilter(val === "All Statuses" ? "" : val)}
                />
              </FiltersButton>
            </>
          }
        />

        <DataTable data={filteredDisputes} columns={columns} />

        <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}