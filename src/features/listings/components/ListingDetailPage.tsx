import { useParams, useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "@/components/generic/Button";
import ImageGallery from "@/components/generic/ImageGallery";
import ListingLocationMap from "@/components/generic/ListingLocationMap";
import avatarPlaceholder from "@/assets/avatar.svg";
import type { ListingDetail } from "../types";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import listingHeader from "@/assets/listing-header.jpg";
import listingMain from "@/assets/listing-main.jpg";
import { AiOutlineExport } from "react-icons/ai";

const statusPillClass: Record<ListingDetail["status"], string> = {
  Active: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  "Pending Review":
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  Flagged: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-9",
  Sold: "text-[#5925DC] bg-[#F4F3FF] dark:text-purple-400 dark:bg-purple-950",
  Delisted:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

// placeholder
const mockListings: Record<string, ListingDetail> = {
  "1": {
    id: "1",
    code: "LST-001",
    name: "6-Seater Dining Set",
    status: "Sold",
    category: "Home & Living",
    postedDate: "Apr 9, 2026",
    views: 1404,
    saves: 131,
    price: "₦954,000",
    condition: "Used - Like New",
    payoutAfterCommission: "₦882,450",
    commissionPercent: "7.5%",
    images: [
      { id: "1", url: listingMain },
      { id: "2", url: "https://placehold.co/600x400/222/fff?text=2" },
      {
        id: "3",
        url: "https://placehold.co/600x400/333/fff?text=3",
        isVideo: true,
      },
    ],
    description:
      "6-Seater Dining Set in used - like new condition, listed by Tunde Balogun (Lagos Mart). Available for immediate pickup or delivery within Abeokuta. All items are inspected by our marketplace team before approval. Buyers are protected by Declut Escrow for the full transaction value.",
    brand: "Dangote",
    itemCondition: "Neatly Used",
    quantityAvailable: 16,
    sku: "SKU-54012",
    saleDetails: {
      buyer: "Femi Lawal",
      amountPaid: "₦274,000",
      paymentMethod: "USSD",
      transactionStatus: "Completed",
      soldOn: "Feb 7, 2026",
    },
    review: {
      reviewerName: "Ngozi Nwosu",
      reviewerId: "USR-004",
      reviewerEmail: "ngozi.nwosu@mail.com",
      rating: 5,
      comment: "Average experience, took a while to ship.",
    },
    activity: [
      { id: "1", label: "Listing created", date: "Apr 9, 2026" },
      { id: "2", label: "Reviewed by moderation", date: "Apr 10, 2026" },
      { id: "3", label: "Status set to Active", date: "Jul 12, 2026" },
      { id: "4", label: "Status set to Sold", date: "Jul 12, 2026" },
    ],
    location: {
      address: "89 Allen Avenue, Abeokuta, Nigeria",
      landmark: "Jara shopping mall",
      lat: 6.5244,
      lng: 3.3792,
    },
    seller: {
      name: "Ngozi Nwosu",
      id: "USR-004",
      email: "ngozi.nwosu@mail.com",
      role: "Seller/Buyer",
      status: "Active",
      company: "Delta Electronics",
      totalListings: 2,
      memberSince: "Apr 27, 2025",
      rating: 4,
    },
  },
  "2": {
    id: "2",
    code: "LST-001",
    name: "6-Seater Dining Set",
    status: "Active",
    category: "Home & Living",
    postedDate: "Apr 9, 2026",
    views: 1404,
    saves: 131,
    price: "₦954,000",
    condition: "Used - Like New",
    payoutAfterCommission: "₦882,450",
    commissionPercent: "7.5%",
    images: [
      { id: "1", url: listingMain },
      { id: "2", url: "https://placehold.co/600x400/222/fff?text=2" },
      {
        id: "3",
        url: "https://placehold.co/600x400/333/fff?text=3",
        isVideo: true,
      },
    ],
    description:
      "6-Seater Dining Set in used - like new condition, listed by Tunde Balogun (Lagos Mart). Available for immediate pickup or delivery within Abeokuta. All items are inspected by our marketplace team before approval. Buyers are protected by Declut Escrow for the full transaction value.",
    brand: "Dangote",
    itemCondition: "Neatly Used",
    quantityAvailable: 16,
    sku: "SKU-54012",
    activity: [
      { id: "1", label: "Listing created", date: "Apr 9, 2026" },
      { id: "2", label: "Reviewed by moderation", date: "Apr 10, 2026" },
      { id: "3", label: "Status set to Active", date: "Jul 12, 2026" },
    ],
    location: {
      address: "89 Allen Avenue, Abeokuta, Nigeria",
      landmark: "Jara shopping mall",
      lat: 6.5244,
      lng: 3.3792,
    },
    seller: {
      name: "Ngozi Nwosu",
      id: "USR-004",
      email: "ngozi.nwosu@mail.com",
      role: "Seller/Buyer",
      status: "Active",
      company: "Delta Electronics",
      totalListings: 2,
      memberSince: "Apr 27, 2025",
      rating: 4,
    },
  },
};

export default function ListingDetailPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const listing = listingId ? mockListings[listingId] : undefined;

  if (!listing) {
    return (
      <div className="text-sm text-brand-gray-light">Listing not found.</div>
    );
  }

  const isSold = listing.status === "Sold";

  return (
    <div>
      <button
        onClick={() => navigate("/listings")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FaArrowLeftLong className="w-4 h-4" /> Back to Listings
      </button>

      {/* header */}
      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg shrink-0">
            <img
              src={listingHeader}
              alt="header-image"
              className="w-10 h-10 rounded-lg shrink-0"
            />
          </span>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-[#1D2939] dark:text-gray-100">
                {listing.name}
              </h1>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusPillClass[listing.status]}`}
              >
                {listing.status}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6F6F6] dark:bg-gray-800 text-brand-gray-dark dark:text-gray-300">
                {listing.category}
              </span>
            </div>
            <p className="text-xs text-brand-gray-light mt-0.5">
              {listing.code} · Posted {listing.postedDate} ·{" "}
              {listing.views.toLocaleString()} views · {listing.saves} saves
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            leftIcon={<IoMail className="w-4 h-4 text-brand-gray-dark" />}
          >
            Email Seller
          </Button>
          {/* {!isSold && <Button leftIcon={<FiFlag className="w-4 h-4" />}>Flag</Button>} */}
          <Button
            leftIcon={<RiDeleteBin6Line className="w-4 h-4" />}
            bgColor="bg-[#FFFBFA] dark:bg-gray-900"
            textColor="text-[#F04438]"
            borderColor="border-[#F04438] dark:border-red-900"
          >
            Remove Listing
          </Button>
        </div>
      </div>

      {/* price row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#16A34A]">
            {listing.price}
          </span>
          <span className="text-sm text-brand-gray-light">
            {listing.condition}
          </span>
        </div>
        <p className="text-sm text-brand-gray-light">
          Payout after {listing.commissionPercent} commission:{" "}
          <span className="font-semibold text-brand-gray-dark dark:text-gray-100">
            {listing.payoutAfterCommission}
          </span>
        </p>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ImageGallery images={listing.images} />

          {/* description */}
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-2">
              Description
            </p>
            <p className="text-sm text-brand-gray-dark dark:text-gray-300 mb-4">
              {listing.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-brand-gray-light">Brand</p>
                <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                  {listing.brand}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-gray-light">Item Condition</p>
                <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                  {listing.itemCondition}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-gray-light">
                  Quantity Available
                </p>
                <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                  {listing.quantityAvailable}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-gray-light">SKU</p>
                <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                  {listing.sku}
                </p>
              </div>
            </div>
          </div>

          {/* sale details - only when sold */}
          {isSold && listing.saleDetails && (
            <div className="detail-section-card border-none">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
                  Sale Details
                </p>
                <a
                  href="#"
                  className="text-xs text-[#DC6803]  underline flex items-center gap-1"
                >
                  View Transaction <AiOutlineExport className="w-4 h-4" />
                </a>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Buyer</span>
                <a
                  href="#"
                  className="text-sm text-brand-blue hover:underline-wavy"
                >
                  {listing.saleDetails.buyer}
                </a>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Amount Paid</span>
                <span className="profile-info-value">
                  {listing.saleDetails.amountPaid}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Method</span>
                <span className="profile-info-value">
                  {listing.saleDetails.paymentMethod}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Transaction Status</span>
                <span className="text-sm font-medium bg-[#ECFDF3] text-[#027A48] rounded-2xl">
                  {listing.saleDetails.transactionStatus}
                </span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Sold On</span>
                <span className="profile-info-value">
                  {listing.saleDetails.soldOn}
                </span>
              </div>
            </div>
          )}

          {/* buyer review - only when sold */}
          {isSold && listing.review && (
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Buyer Review
              </p>
              <div className="flex items-center gap-2.5 mb-2">
                <img
                  src={avatarPlaceholder}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <a
                    href="#"
                    className="text-sm text-brand-blue hover:underline-wavy"
                  >
                    {listing.review.reviewerName}
                  </a>
                  <p className="text-xs text-brand-gray-light">
                    {listing.review.reviewerId} · {listing.review.reviewerEmail}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < listing.review!.rating
                        ? "text-[#F79009]"
                        : "text-gray-200"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-brand-gray-dark dark:text-gray-300">
                {listing.review.comment}
              </p>
            </div>
          )}

          {/* activity */}
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Activity
            </p>
            <div className="flex flex-col">
              {listing.activity.map((event) => (
                <div
                  key={event.id}
                  className="border-l-2 border-[#BFDBFE] border-b border-b-gray-100 dark:border-b-gray-800 pl-3 py-3 mb-2"
                >
                  <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                    {event.label}
                  </p>
                  <p className="text-xs text-brand-gray-light mt-0.5">
                    {event.date}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* right column */}
        <div className="flex flex-col gap-6">
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Location
            </p>
            <ListingLocationMap
              lat={listing.location.lat}
              lng={listing.location.lng}
              label={listing.location.landmark}
            />
            <p className="text-sm text-brand-gray-dark dark:text-gray-200 mt-3">
              {listing.location.address}
            </p>
            <a
              href={`https://www.google.com/maps?q=${listing.location.lat},${listing.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg mt-3 cursor-pointer"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Seller
            </p>
            <div className="flex items-center gap-2.5 mb-3">
              <img
                src={listing.seller.avatarUrl || avatarPlaceholder}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                  {listing.seller.name}
                </p>
                <p className="text-xs text-brand-gray-light">
                  {listing.seller.id} · {listing.seller.email} ·{" "}
                  {listing.seller.company}
                </p>
              </div>
            </div>

            <div className="profile-info-row">
              <span className="profile-info-label">Role</span>
              <span className="profile-info-value">{listing.seller.role}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Status</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF3] text-[#027A48] dark:bg-green-950 dark:text-green-400">
                {listing.seller.status}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Company</span>
              <span className="profile-info-value">
                {listing.seller.company}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Total Listings</span>
              <span className="profile-info-value">
                {listing.seller.totalListings}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Member Since</span>
              <span className="profile-info-value">
                {listing.seller.memberSince}
              </span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Rating</span>
              <span className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i < listing.seller.rating
                        ? "text-[#F79009]"
                        : "text-gray-200"
                    }
                  >
                    ★
                  </span>
                ))}
              </span>
            </div>

            <button
              onClick={() => navigate(`/users/${listing.seller.id}`)}
              className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg mt-3 cursor-pointer"
            >
              View All Listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
