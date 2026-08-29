import { useMemo, useState } from "react";
import PageHeader from "@/components/generic/PageHeader";
import TabFilter from "@/components/generic/TabFilter";
import TableToolbar from "@/components/generic/TableToolbar";
import DateRangeFilter, {
  type DateRange,
} from "@/components/generic/DateRangeFilter";
// import FiltersButton from "@/components/generic/FiltersButton";
// import CustomSelect from "@/components/generic/CustomSelect";
import DataTable from "@/components/generic/DataTable";
import Pagination from "@/components/generic/Pagination";
import Button from "@/components/generic/Button";
import { PiExportFill } from "react-icons/pi";
// import { FiChevronDown } from "react-icons/fi";
import { createReviewColumns } from "./columns";
import ViewReviewModal from "./ViewReviewModal";
import type { ReviewRow } from "../types";
import { showToast } from "@/lib/utils/toast";
import {
  useReviews,
  useResolveReview,
  useFlagReview,
  useDeleteReview,
  useExportReviews,
} from "../queries";
import { usePageSize } from "@/lib/hooks/usePageSize";

const tabs = ["All", "Visible", "Resolved", "Flagged"];

export default function ReviewsPage() {
  const PAGE_SIZE = usePageSize();

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingReview, setViewingReview] = useState<ReviewRow | null>(null);

  const reviewsQuery = useReviews({
    page: currentPage,
    limit: PAGE_SIZE,
    status: activeTab === "All" ? undefined : activeTab.toLowerCase(),
    startDate: dateRange.from || undefined,
    endDate: dateRange.to || undefined,
  });

  const { data } = reviewsQuery;

  const { mutateAsync: resolveReview, isPending: isResolving } =
    useResolveReview();
  const { mutateAsync: flagReview, isPending: isFlagging } = useFlagReview();
  const { mutateAsync: removeReview } = useDeleteReview();
  const { mutateAsync: exportReviews } = useExportReviews();

  const handleExport = () => {
    showToast.promise(exportReviews({}), {
      loading: "Preparing export...",
      success: "Export downloaded.",
      error: "Export failed.",
    });
  };

  const handleFlagFromModal = () => {
    if (!viewingReview) return;

    showToast.promise(
      flagReview(viewingReview._id).then(() => setViewingReview(null)),
      {
        loading: "Flagging review...",
        success: "Review flagged.",
        error: "Couldn't flag review.",
      },
    );
  };

  const reviews = useMemo(() => data?.results ?? [], [data?.results]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const columns = useMemo(
    () =>
      createReviewColumns({
        onView: (review) => setViewingReview(review),
        onResolve: (review) => {
          showToast.promise(resolveReview(review._id), {
            loading: "Resolving review...",
            success: "Review resolved.",
            error: "Couldn't resolve review.",
          });
        },
        onFlag: (review) => {
          showToast.promise(flagReview(review._id), {
            loading: "Flagging review...",
            success: "Review flagged.",
            error: "Couldn't flag review.",
          });
        },
        onRemove: (review) => {
          showToast.promise(removeReview(review._id), {
            loading: "Removing review...",
            success: "Review removed.",
            error: "Couldn't remove review.",
          });
        },
      }),
    [resolveReview, flagReview, removeReview],
  );

  const visibleReviews = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return reviews;
    return reviews.filter(
      (review) =>
        (review.reviewer?.name.toLowerCase().includes(query) ?? false) ||
        (review.listing?.title.toLowerCase().includes(query) ?? false) ||
        review.comment.toLowerCase().includes(query),
    );
  }, [reviews, search]);

  const handleResolveFromModal = () => {
    if (!viewingReview) return;

    showToast.promise(
      resolveReview(viewingReview._id).then(() => setViewingReview(null)),
      {
        loading: "Resolving review...",
        success: "Review resolved.",
        error: "Couldn't resolve review.",
      },
    );
  };

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="Moderate buyer and seller reviews left across the marketplace."
        actions={
          <Button
            leftIcon={<PiExportFill className="w-4 h-4 text-[#98A2B3]" />}
            // rightIcon={
            //   <FiChevronDown className="w-4 h-4 text-brand-gray-dark" />
            // }
            onClick={handleExport}
          >
            Export
          </Button>
        }
      />

      <TabFilter tabs={tabs} active={activeTab} onChange={handleTabChange} />

      <TableToolbar
        label="Reviews"
        count={search ? visibleReviews.length : total}
        searchValue={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search reviews..."
        filterSlot={
          <DateRangeFilter value={dateRange} onChange={handleDateRangeChange} />
        }
      />

      <DataTable
        data={visibleReviews}
        columns={columns}
        query={reviewsQuery}
        emptyMessage="No reviews found."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      {viewingReview && (
        <ViewReviewModal
          review={viewingReview}
          isSubmitting={isResolving || isFlagging}
          onClose={() => setViewingReview(null)}
          onResolve={handleResolveFromModal}
          onFlag={handleFlagFromModal}
        />
      )}
    </div>
  );
}
