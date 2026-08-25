import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
import FiltersButton from "@/components/generic/FiltersButton";
import CustomSelect from "@/components/generic/CustomSelect";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
// import { FiChevronDown } from "react-icons/fi";
import { createListingColumns } from "./columns";
import { useDeleteListing, useListings } from "../queries";
import { PAGE_SIZE } from "@/lib/constants/pagination";
import { showToast } from "@/lib/utils/toast";

const tabs = ["All", "Active", "Sold", "Deleted"];

export default function ListingsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("");

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
    setDateRange({ from: "", to: "" });
    setCategory("");
  };

  const { data, isLoading } = useListings({
    page: currentPage,
    limit: PAGE_SIZE,
    status: activeTab === "All" ? "all" : activeTab.toLowerCase(),
    search: debouncedSearch || undefined,
  });

  const { mutateAsync: removeListing } = useDeleteListing();

  const listings = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const columns = useMemo(
    () =>
      createListingColumns({
        onViewDetails: (listing) => navigate(`/listings/${listing.slug}`),
        onEdit: (listing) => console.log("edit", listing._id), // TODO: wire edit flow
        onDelist: (listing) => {
          showToast.promise(removeListing(listing._id), {
            loading: `Delisting ${listing.title}...`,
            success: `${listing.title} has been removed.`,
            error: "Couldn't remove listing.",
          });
        },
        onRelist: (listing) => console.log("relist", listing._id), // TODO: wire relist endpoint
      }),
    [navigate, removeListing],
  );

  const visibleListings = useMemo(() => {
    return listings.filter((listing) => {
      if (category && listing.category?.title !== category) return false;

      if (dateRange.from || dateRange.to) {
        const created = new Date(listing.createdAt).getTime();
        if (Number.isNaN(created)) return false;
        if (
          dateRange.from &&
          created < new Date(dateRange.from).setHours(0, 0, 0, 0)
        )
          return false;
        if (
          dateRange.to &&
          created > new Date(dateRange.to).setHours(23, 59, 59, 999)
        )
          return false;
      }

      return true;
    });
  }, [listings, category, dateRange]);

  const categoryOptions = useMemo(() => {
    const titles = new Set(
      listings.map((l) => l.category?.title).filter(Boolean) as string[],
    );
    return ["All Categories", ...Array.from(titles).sort()];
  }, [listings]);

  const activeFilterCount =
    (category ? 1 : 0) + (dateRange.from || dateRange.to ? 1 : 0);

  return (
    <div>
      <PageHeader
        title="Listings"
        subtitle="Review, moderate, and manage every item listed on the marketplace."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            // rightIcon={<FiChevronDown className="w-4 h-4 text-brand-gray-dark" />}
            onClick={() => {
              /* TODO: no listings export endpoint yet */
            }}
          >
            Export
          </Button>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <div>
        <TableToolbar
          label="Listings"
          count={activeFilterCount > 0 ? visibleListings.length : total}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search listings..."
          filterSlot={
            <>
              <DateRangeFilter value={dateRange} onChange={setDateRange} />
              <FiltersButton activeCount={category ? 1 : 0}>
                <CustomSelect
                  label="Category"
                  value={category || "All Categories"}
                  options={categoryOptions}
                  onChange={(val) =>
                    setCategory(val === "All Categories" ? "" : val)
                  }
                />
              </FiltersButton>
            </>
          }
        />

        <DataTable
          data={visibleListings}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No listings found."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
