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
import { createListingColumns } from "./columns";
import { showToast } from "@/lib/utils/toast";
import EditListingModal from "./EditListingModal";
import type { ListingRow, UpdateListingPayload } from "../types";
import {
  useDeleteListing,
  useListings,
  useUpdateListing,
  useFlagListing,
  useUnflagListing,
  useDelistListing,
  useRelistListing,
  useExportListings,
} from "../queries";
import { usePageSize } from "@/lib/hooks/usePageSize";

const tabs = ["All", "Active", "Sold", "Deleted", "Flagged", "Archived"];

export default function ListingsPage() {
    const PAGE_SIZE = usePageSize();
  
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

  const listingsQuery = useListings({
    page: currentPage,
    limit: PAGE_SIZE,
    status: activeTab === "All" ? "all" : activeTab.toLowerCase(),
    search: debouncedSearch || undefined,
  });

  const { data } = listingsQuery;

  const [editingListing, setEditingListing] = useState<ListingRow | null>(null);

  const { mutateAsync: removeListing } = useDeleteListing();
  const { mutateAsync: updateListing, isPending: isUpdating } =
    useUpdateListing();
  const { mutateAsync: flagListing } = useFlagListing();
  const { mutateAsync: unflagListing } = useUnflagListing();
  const { mutateAsync: delistListing } = useDelistListing();
  const { mutateAsync: relistListing } = useRelistListing();
  const { mutateAsync: exportListings } = useExportListings();

  const listings = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const columns = useMemo(
    () =>
      createListingColumns({
        onViewDetails: (listing) => navigate(`/listings/${listing.slug}`),
        onEdit: (listing) => setEditingListing(listing),
        onFlag: (listing) => {
          showToast.promise(flagListing(listing._id), {
            loading: `Flagging ${listing.title}...`,
            success: `${listing.title} has been flagged.`,
            error: "Couldn't flag listing.",
          });
        },
        onUnflag: (listing) => {
          showToast.promise(unflagListing(listing._id), {
            loading: `Unflagging ${listing.title}...`,
            success: `${listing.title} has been unflagged.`,
            error: "Couldn't unflag listing.",
          });
        },
        onDelist: (listing) => {
          showToast.promise(delistListing(listing._id), {
            loading: `Delisting ${listing.title}...`,
            success: `${listing.title} has been delisted.`,
            error: "Couldn't delist listing.",
          });
        },
        onRelist: (listing) => {
          showToast.promise(relistListing(listing._id), {
            loading: `Relisting ${listing.title}...`,
            success: `${listing.title} has been relisted.`,
            error: "Couldn't relist listing.",
          });
        },
        onRemove: (listing) => {
          showToast.promise(removeListing(listing._id), {
            loading: `Removing ${listing.title}...`,
            success: `${listing.title} has been removed.`,
            error: "Couldn't remove listing.",
          });
        },
      }),
    [
      navigate,
      removeListing,
      flagListing,
      unflagListing,
      delistListing,
      relistListing,
    ],
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

  const handleConfirmEdit = (payload: UpdateListingPayload) => {
    if (!editingListing) return;

    showToast.promise(
      updateListing({ listingId: editingListing._id, payload }).then(() =>
        setEditingListing(null),
      ),
      {
        loading: `Updating ${editingListing.title}...`,
        success: "Listing updated.",
        error: "Couldn't update listing.",
      },
    );
  };

  const handleExport = () => {
    showToast.promise(
      exportListings({
        status: activeTab === "All" ? "all" : activeTab.toLowerCase(),
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
        title="Listings"
        subtitle="Review, moderate, and manage every item listed on the marketplace."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            onClick={handleExport}
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
          query={listingsQuery}
          emptyMessage="No listings found."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {editingListing && (
        <EditListingModal
          title={editingListing.title}
          price={editingListing.price}
          isSubmitting={isUpdating}
          onClose={() => setEditingListing(null)}
          onConfirm={handleConfirmEdit}
        />
      )}
    </div>
  );
}
