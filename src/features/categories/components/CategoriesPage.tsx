import { useMemo, useState } from "react";
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
import { FaCirclePlus } from "react-icons/fa6";
import { createCategoryColumns } from "./columns";
import AddCategoryModal from "./AddCategoryModal";
import type { CategoryRow } from "../types";
import { getYearOptions } from "@/lib/utils/getYearOptions";


const tabs = ["All", "Active", "Hidden"];
const yearOptions = getYearOptions();


const categories: CategoryRow[] = [
  { id: "1", name: "Electronics", listings: "2,364", status: "Hidden", created: "Aug 24, 2025" },
  { id: "2", name: "Fashion", listings: "2,870", status: "Active", created: "Feb 28, 2026" },
  { id: "3", name: "Home & Living", listings: "-", status: "Hidden", created: "Feb 7, 2026" },
  { id: "4", name: "Vehicles", listings: "2,852", status: "Active", created: "Feb 1, 2025" },
  { id: "5", name: "Real Estate", listings: "2,017", status: "Active", created: "Jan 9, 2025" },
  { id: "6", name: "Beauty", listings: "234", status: "Hidden", created: "May 21, 2026" },
  { id: "7", name: "Groceries", listings: "568", status: "Active", created: "Oct 11, 2025" },
  { id: "8", name: "Furniture", listings: "45", status: "Hidden", created: "Mar 26, 2026" },
];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const columns = useMemo(
    () =>
      createCategoryColumns({
        onEdit: (category) => console.log("edit", category.id), // TODO: wire edit flow
        onToggleVisibility: (category) => console.log("toggle visibility", category.id), // TODO: wire visibility toggle
        onRemove: (category) => console.log("remove", category.id), // TODO: wire remove flow / confirm modal
      }),
    [],
  );

  const filteredCategories = categories.filter((category) => {
    const matchesTab = activeTab === "All" || category.status === activeTab;
    const matchesSearch = category.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddCategory = (data: { name: string; status: string }) => {
    // TODO: wire to categoriesApi.create
    console.log("adding category", data);
    setAddModalOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organize the taxonomy buyers use to browse the marketplace."
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
              leftIcon={<FaCirclePlus className="w-4 h-4 text-white" />}
              bgColor="bg-brand-blue hover:bg-[#3F5EE0]"
              textColor="text-white"
              borderColor="border-transparent"
              onClick={() => setAddModalOpen(true)}
            >
              Add Category
            </Button>
          </>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={setActiveTab} />

      <div className="overflow-hidden">
        <TableToolbar
          label="Categories"
          count={filteredCategories.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search categories..."
          filterSlot={
            <>
              <DateFilterDropdown value={year} options={yearOptions} onChange={setYear} />
              <FiltersButton activeCount={statusFilter ? 1 : 0}>
                <CustomSelect
                  label="Status"
                  value={statusFilter || "All Statuses"}
                  options={["All Statuses", "Active", "Hidden"]}
                  onChange={(val) => setStatusFilter(val === "All Statuses" ? "" : val)}
                />
              </FiltersButton>
            </>
          }
        />

        <DataTable data={filteredCategories} columns={columns} />

        <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
      </div>

      {addModalOpen && (
        <AddCategoryModal onClose={() => setAddModalOpen(false)} onSubmit={handleAddCategory} />
      )}
    </div>
  );
}