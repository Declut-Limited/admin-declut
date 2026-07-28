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
import { createListingColumns } from "./columns";
import type { ListingRow } from "../types";
import { getYearOptions } from "@/lib/utils/getYearOptions";

// const tabs = ["All", "Active", "Pending Review", "Flagged", "Sold"];
const tabs = ["All", "Active", "Sold"];
const yearOptions = getYearOptions();


const listings: ListingRow[] = [
  { id: "1", name: "6-Seater Dining Set", code: "LST-001", category: "Home & Living", sellerName: "Tunde Balogun", sellerInitials: "OD", price: "₦954,000", location: "Abeokuta", date: "Apr 9, 2026", status: "Active" },
  { id: "2", name: 'LG 55" Smart TV', code: "LST-002", category: "Electronics", sellerName: "Rita Ogunleye", sellerInitials: "OD", price: "₦2,883,000", location: "Abeokuta", date: "Oct 13, 2025", status: "Active" },
  { id: "3", name: "Wardrobe 4-Door", code: "LST-003", category: "Furniture", sellerName: "Aisha Afolabi", sellerInitials: "OD", price: "₦1,642,000", location: "Port Harcourt", date: "Sep 16, 2025", status: "Sold" },
  { id: "4", name: "Yamaha Motorcycle", code: "LST-004", category: "Vehicles", sellerName: "Amaka Adebayo", sellerInitials: "OD", price: "₦4,127,000", location: "Abeokuta", date: "Apr 7, 2026", status: "Active" },
  { id: "5", name: "Tecno Camon 19", code: "LST-005", category: "Phones & Tablets", sellerName: "Bayo Okonkwo", sellerInitials: "OD", price: "₦2,697,000", location: "Port Harcourt", date: "Dec 7, 2025", status: "Active" },
  { id: "6", name: "L-Shaped Sofa", code: "LST-006", category: "Furniture", sellerName: "Rita Ogunleye", sellerInitials: "OD", price: "₦670,000", location: "Ibadan", date: "Oct 28, 2025", status: "Sold" },
  { id: "7", name: "Terrace House, Ikeja", code: "LST-007", category: "Real Estate", sellerName: "Tunde Balogun", sellerInitials: "OD", price: "₦1,973,000", location: "Enugu", date: "Oct 1, 2025", status: "Active" },
  { id: "8", name: "Aso-Oke Fabric", code: "LST-008", category: "Fashion", sellerName: "Tosin Adeyemi", sellerInitials: "OD", price: "₦768,000", location: "Kaduna", date: "Jun 6, 2026", status: "Delisted" },
];

export default function ListingsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      createListingColumns({
        onViewDetails: (listing) => navigate(`/listings/${listing.id}`),
        onEdit: (listing) => console.log("edit", listing.id), // TODO: wire edit flow
        onDelist: (listing) => console.log("delist", listing.id), // TODO: wire delist flow / modal
        onRelist: (listing) => console.log("relist", listing.id), // TODO: wire relist flow
      }),
    [],
  );

  const filteredListings = listings.filter((listing) => {
    const matchesTab = activeTab === "All" || listing.status === activeTab;
    const matchesSearch =
      listing.name.toLowerCase().includes(search.toLowerCase()) ||
      listing.sellerName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Listings"
        subtitle="Review, moderate, and manage every item listed on the marketplace."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            rightIcon={<FiChevronDown className="w-4 h-4 text-[#475467]" />}
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
          label="Listings"
          count={filteredListings.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search listings..."
          filterSlot={
            <>
              <DateFilterDropdown value={year} options={yearOptions} onChange={setYear} />
              <FiltersButton activeCount={category ? 1 : 0}>
                <CustomSelect
                  label="Category"
                  value={category || "All Categories"}
                  options={["All Categories", "Electronics", "Furniture", "Vehicles", "Real Estate", "Fashion"]}
                  onChange={(val) => setCategory(val === "All Categories" ? "" : val)}
                />
              </FiltersButton>
            </>
          }
        />

        <DataTable data={filteredListings} columns={columns} />

        <Pagination currentPage={currentPage} totalPages={5} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}