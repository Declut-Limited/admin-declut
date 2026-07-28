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
import { createReviewColumns } from "./columns";
import ViewReviewModal from "./ViewReviewModal";
import type { ReviewRow } from "../types";
import { getYearOptions } from "@/lib/utils/getYearOptions";
import listingHeader from "@/assets/listing-header.jpg";

const tabs = ["All"];
const yearOptions = getYearOptions();


const reviews: ReviewRow[] = [
  {
    id: "1",
    reviewerName: "Toluwani Bakare",
    reviewerId: "USR-001",
    reviewerEmail: "toluwani@mail.com",
    reviewerCompany: "Lagos Mart",
    listingName: "iPad Pro 2017 Model",
    listingCode: "LST-011",
    listingSubmittedDate: "Aug 24, 2025",
    listingImageUrl: listingHeader,
    rating: 4,
    comment: "The product exceeded my expectations! It arrived on time and I loved it",
    status: "Published",
    date: "Aug 24, 2025",
  },
  {
    id: "2",
    reviewerName: "Hannah Pedro",
    reviewerId: "USR-002",
    reviewerEmail: "hannah@mail.com",
    reviewerCompany: "Delta Electronics",
    listingName: "Gopro hero 7 (with receipt)",
    listingCode: "LST-012",
    listingSubmittedDate: "Feb 28, 2026",
    rating: 3,
    comment: "I was disappointed with my purchase. The item did not...",
    status: "Published",
    date: "Feb 28, 2026",
  },
  {
    id: "3",
    reviewerName: "Oyebamiji Oluwasola",
    reviewerId: "USR-003",
    reviewerEmail: "oyebamiji@mail.com",
    reviewerCompany: "Coastal Goods Ltd",
    listingName: "Brand New Bike, Local buyer or International buyer",
    listingCode: "LST-013",
    listingSubmittedDate: "Feb 7, 2026",
    rating: 4,
    comment: "Fantastic quality! I love how it fits perfectly and works ac...",
    status: "Published",
    date: "Feb 7, 2026",
  },
  {
    id: "4",
    reviewerName: "Femi Babalola",
    reviewerId: "USR-004",
    reviewerEmail: "femi@mail.com",
    reviewerCompany: "Zenith Traders",
    listingName: "Playstation 4 Limited Edition (...",
    listingCode: "LST-014",
    listingSubmittedDate: "Feb 1, 2025",
    rating: 4,
    comment: "Not what I expected. The item was damaged upon arriv...",
    status: "Published",
    date: "Feb 1, 2025",
  },
  {
    id: "5",
    reviewerName: "Tolani Bayode",
    reviewerId: "USR-005",
    reviewerEmail: "tolani@mail.com",
    reviewerCompany: "Lagos Mart",
    listingName: "Dell Computer Monitor",
    listingCode: "LST-015",
    listingSubmittedDate: "Jan 9, 2025",
    rating: 4,
    comment: "Great value for the price! It performs well and I am very s...",
    status: "Published",
    date: "Jan 9, 2025",
  },
  {
    id: "6",
    reviewerName: "Folasayo Ogunnaike",
    reviewerId: "USR-006",
    reviewerEmail: "folasayo@mail.com",
    reviewerCompany: "Delta Electronics",
    listingName: "Coach Tabby 26 for sale",
    listingCode: "LST-016",
    listingSubmittedDate: "May 21, 2026",
    rating: 1,
    comment: "The product was okay, but it didn't live up to the hype. I...",
    status: "Flagged",
    date: "May 21, 2026",
  },
  {
    id: "7",
    reviewerName: "Emmanuel Amuneke",
    reviewerId: "USR-007",
    reviewerEmail: "emmanuel@mail.com",
    reviewerCompany: "Coastal Goods Ltd",
    listingName: "Heimer Miller Sofa (Mint Condi...",
    listingCode: "LST-017",
    listingSubmittedDate: "Oct 11, 2025",
    rating: 4.5,
    comment: "Absolutely love it! It works perfectly and has made my lif...",
    status: "Published",
    date: "Oct 11, 2025",
  },
  {
    id: "8",
    reviewerName: "Ebubechukwu Agnes",
    reviewerId: "USR-008",
    reviewerEmail: "ebube@mail.com",
    reviewerCompany: "Zenith Traders",
    listingName: "Macbook Pro 16 inch (2020) F...",
    listingCode: "LST-018",
    listingSubmittedDate: "Mar 26, 2026",
    rating: 3,
    comment: "I regret buying this. It broke after just a few uses and cus...",
    status: "Published",
    date: "Mar 26, 2026",
  },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [viewingReview, setViewingReview] = useState<ReviewRow | null>(null);

  const columns = useMemo(
    () =>
      createReviewColumns({
        onView: (review) => setViewingReview(review),
        onResolve: (review) => console.log("resolve", review.id), // TODO: wire resolve flow
      }),
    [],
  );

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.reviewerName.toLowerCase().includes(search.toLowerCase()) ||
      review.listingName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleResolveFromModal = () => {
    // TODO: wire to reviewsApi.resolve once endpoint is confirmed
    console.log("resolving", viewingReview?.id);
    setViewingReview(null);
  };

  return (
    <div>
      <PageHeader
        title="Reviews"
        subtitle="Moderate buyer and seller reviews left across the marketplace."
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
          label="Reviews"
          count={filteredReviews.length}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search categories..."
          filterSlot={
            <>
              <DateFilterDropdown
                value={year}
                options={yearOptions}
                onChange={setYear}
              />
              <FiltersButton activeCount={statusFilter ? 1 : 0}>
                <CustomSelect
                  label="Status"
                  value={statusFilter || "All Statuses"}
                  options={["All Statuses", "Published", "Flagged"]}
                  onChange={(val) =>
                    setStatusFilter(val === "All Statuses" ? "" : val)
                  }
                />
              </FiltersButton>
            </>
          }
        />

        <DataTable data={filteredReviews} columns={columns} />

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </div>

      {viewingReview && (
        <ViewReviewModal
          review={viewingReview}
          onClose={() => setViewingReview(null)}
          onResolve={handleResolveFromModal}
        />
      )}
    </div>
  );
}
