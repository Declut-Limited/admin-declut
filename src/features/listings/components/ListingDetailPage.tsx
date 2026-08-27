import { useParams, useNavigate } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "@/components/generic/Button";
import ImageGallery from "@/components/generic/ImageGallery";
import ListingLocationMap from "@/components/generic/ListingLocationMap";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import listingHeader from "@/assets/listing-header.jpg";
import NotFoundState from "@/components/generic/NotFoundState";
import { FiEdit3, FiFlag, FiPackage } from "react-icons/fi";
import PageLoader from "@/components/generic/PageLoader";
import {
  useListing,
  useDeleteListing,
  useEmailSeller,
  useUpdateListing,
  useFlagListing,
  useUnflagListing,
  useDelistListing,
  useRelistListing,
} from "../queries";
import { showToast } from "@/lib/utils/toast";
import { useState } from "react";
import type { EmailSellerPayload, UpdateListingPayload } from "../types";
import EmailSellerModal from "./EmailSellerModal";
import EditListingModal from "./EditListingModal";
import { getInitials } from "@/lib/utils/getInitials";

const NOT_IN_API_YET = "—";

const statusPillClass: Record<string, string> = {
  active: "text-[#027A48] bg-[#F6FEF9] dark:text-green-400 dark:bg-green-950",
  pending_review:
    "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  pending: "text-[#B54708] bg-[#FFFAEB] dark:text-amber-400 dark:bg-amber-950",
  flagged: "text-[#B42318] bg-[#FEF3F2] dark:text-red-400 dark:bg-red-9",
  sold: "text-[#5925DC] bg-[#F4F3FF] dark:text-purple-400 dark:bg-purple-950",
  delisted:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
  deleted:
    "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800",
};

const sellerStatusPillClass: Record<string, string> = {
  active: "bg-[#ECFDF3] text-[#027A48] dark:bg-green-950 dark:text-green-400",
  pending: "bg-[#FFFAEB] text-[#B54708] dark:bg-amber-950 dark:text-amber-400",
  suspended: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
  banned: "bg-[#FEF3F2] text-[#B42318] dark:bg-red-950 dark:text-red-400",
};

const statusFallback =
  "text-brand-gray-light bg-gray-50 dark:text-gray-400 dark:bg-gray-800";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function formatStatus(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatEventLabel(event: string) {
  return event
    .split(".")
    .pop()!
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function ListingDetailPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();

  const { data: listing, isLoading, isError } = useListing(listingId);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { mutateAsync: removeListing, isPending: isRemoving } =
    useDeleteListing();
  const { mutateAsync: updateListing, isPending: isUpdating } =
    useUpdateListing();
  const { mutateAsync: flagListing } = useFlagListing();
  const { mutateAsync: unflagListing } = useUnflagListing();
  const { mutateAsync: delistListing } = useDelistListing();
  const { mutateAsync: relistListing } = useRelistListing();
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const { mutateAsync: sendEmail, isPending: isSendingEmail } =
    useEmailSeller();

  const handleSendEmail = (payload: EmailSellerPayload) => {
    if (!listing?.id) return;

    const listingId = listing.id;

    showToast.promise(
      sendEmail({ listingId, payload }).then(() => setEmailModalOpen(false)),
      {
        loading: "Sending email...",
        success: `Your message has been sent to ${seller?.name ?? "the seller"}.`,
        error: "Couldn't send email.",
      },
    );
  };

  if (isLoading) return <PageLoader />;
  if (isError || !listing) {
    return (
      <NotFoundState
        icon={<FiPackage className="w-5 h-5" />}
        message="Listing not found."
      />
    );
  }

  const isSold = listing.status === "sold";
  const seller = listing.seller;
  const specs = listing.specs ?? {};
  const coordinates = listing.location?.coordinates;
  const lat = coordinates?.[1];
  const lng = coordinates?.[0];

  const galleryImages = listing.images.map((image, index) => ({
    id: String(index),
    url: image.url,
  }));

  const handleRemoveListing = () => {
    showToast.promise(
      removeListing(listing.id).then(() => navigate("/listings")),
      {
        loading: `Removing ${listing.title}...`,
        success: `${listing.title} has been removed.`,
        error: "Couldn't remove listing.",
      },
    );
  };

  const handleToggleFlag = () => {
    const isFlagged = listing.status === "flagged";
    showToast.promise(
      isFlagged ? unflagListing(listing.id) : flagListing(listing.id),
      {
        loading: isFlagged ? "Unflagging..." : "Flagging...",
        success: isFlagged ? "Listing unflagged." : "Listing flagged.",
        error: "Couldn't update listing.",
      },
    );
  };

  const handleToggleDelist = () => {
    const isDelisted =
      listing.status === "delisted" || listing.status === "deleted";
    showToast.promise(
      isDelisted ? relistListing(listing.id) : delistListing(listing.id),
      {
        loading: isDelisted ? "Relisting..." : "Delisting...",
        success: isDelisted ? "Listing relisted." : "Listing delisted.",
        error: "Couldn't update listing.",
      },
    );
  };

  const handleConfirmEdit = (payload: UpdateListingPayload) => {
    showToast.promise(
      updateListing({ listingId: listing.id, payload }).then(() =>
        setEditModalOpen(false),
      ),
      {
        loading: "Updating listing...",
        success: "Listing updated.",
        error: "Couldn't update listing.",
      },
    );
  };

  return (
    <div>
      <button
        onClick={() => navigate("/listings")}
        className="flex items-center gap-1.5 text-sm text-brand-blue hover:underline mb-4 cursor-pointer"
      >
        <FaArrowLeftLong className="w-4 h-4" /> Back to Listings
      </button>

      <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg shrink-0">
            <img
              src={listing.images[0]?.url ?? listingHeader}
              alt="header-image"
              className="w-10 h-10 rounded-lg shrink-0"
            />
          </span>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-[#1D2939] dark:text-gray-100">
                {listing.title}
              </h1>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  statusPillClass[listing.status] ?? statusFallback
                }`}
              >
                {formatStatus(listing.status)}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F6F6F6] dark:bg-gray-800 text-brand-gray-dark dark:text-gray-300">
                {listing.category?.title ?? NOT_IN_API_YET}
              </span>
            </div>
            <p className="text-xs text-brand-gray-light mt-0.5">
              {listing.slug ?? NOT_IN_API_YET} · Posted{" "}
              {formatDate(listing.createdAt)} · {listing.views.toLocaleString()}{" "}
              views · {listing.saves} saves
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setEmailModalOpen(true)}
            disabled={!seller}
            leftIcon={<IoMail className="w-4 h-4 text-brand-gray-dark" />}
          >
            Email Seller
          </Button>

          <Button
            onClick={() => setEditModalOpen(true)}
            leftIcon={<FiEdit3 className="w-4 h-4 text-brand-gray-dark" />}
          >
            Edit
          </Button>

          <Button
            onClick={handleToggleFlag}
            leftIcon={<FiFlag className="w-4 h-4 text-brand-gray-dark" />}
          >
            {listing.status === "flagged" ? "Unflag" : "Flag"}
          </Button>

          <Button
            onClick={handleToggleDelist}
            bgColor="bg-white dark:bg-gray-900"
            textColor="text-brand-gray-dark dark:text-gray-200"
            borderColor="border-gray-200 dark:border-gray-700"
          >
            {listing.status === "delisted" || listing.status === "deleted"
              ? "Relist"
              : "Delist"}
          </Button>

          <Button
            onClick={handleRemoveListing}
            disabled={isRemoving}
            leftIcon={<RiDeleteBin6Line className="w-4 h-4" />}
            bgColor="bg-[#FFFBFA] dark:bg-gray-900"
            textColor="text-[#F04438]"
            borderColor="border-[#F04438] dark:border-red-900"
          >
            {isRemoving ? "Removing..." : "Remove Listing"}
          </Button>
        </div>
      </div>

      {/* price row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-[#16A34A]">
            {currency.format(listing.price)}
          </span>
          <span className="text-sm text-brand-gray-light">
            {(specs.condition ?? listing.condition)
              ? formatStatus(String(specs.condition ?? listing.condition))
              : NOT_IN_API_YET}
          </span>
        </div>
        {/* TODO: commission percent and payout are not returned by the API */}
        <p className="text-sm text-brand-gray-light">
          Payout after {NOT_IN_API_YET} commission:{" "}
          <span className="font-semibold text-brand-gray-dark dark:text-gray-100">
            {NOT_IN_API_YET}
          </span>
        </p>
      </div>

      {/* main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <ImageGallery images={galleryImages} />

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
                  {String(specs.brand ?? NOT_IN_API_YET)}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-gray-light">Item Condition</p>
                <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                  {specs.condition
                    ? formatStatus(String(specs.condition))
                    : NOT_IN_API_YET}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-gray-light">
                  Quantity Available
                </p>
                <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                  {String(specs.quantity ?? NOT_IN_API_YET)}
                </p>
              </div>
              <div>
                <p className="text-xs text-brand-gray-light">SKU</p>
                <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                  {String(specs.sku ?? NOT_IN_API_YET)}
                </p>
              </div>
            </div>
          </div>

          {/* sale details - only when sold */}
          {/* TODO: no saleDetails object in the API response yet */}
          {isSold && (
            <div className="detail-section-card border-none">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide">
                  Sale Details
                </p>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Buyer</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Amount Paid</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Payment Method</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Transaction Status</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Sold On</span>
                <span className="profile-info-value">{NOT_IN_API_YET}</span>
              </div>
            </div>
          )}

          {/* buyer review - only when sold */}
          {/* TODO: no review object in the API response yet */}
          {isSold && (
            <div className="detail-section-card border-none">
              <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
                Buyer Review
              </p>
              <p className="text-sm text-brand-gray-light">{NOT_IN_API_YET}</p>
            </div>
          )}

          {/* activity */}
          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Activity
            </p>
            <div className="flex flex-col">
              {listing.recentActivity.map((event) => (
                <div
                  key={event._id}
                  className="border-l-2 border-[#BFDBFE] border-b border-b-gray-100 dark:border-b-gray-800 pl-3 py-3 mb-2"
                >
                  <p className="text-sm font-medium text-brand-gray-dark dark:text-gray-100">
                    {formatEventLabel(event.event)}
                  </p>
                  <p className="text-xs text-brand-gray-light mt-0.5">
                    {formatDate(event.createdAt)}
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
            {lat !== undefined && lng !== undefined && (
              <ListingLocationMap
                lat={lat}
                lng={lng}
                label={listing.locationLabel ?? listing.address}
              />
            )}
            <p className="text-sm text-brand-gray-dark dark:text-gray-200 mt-3">
              {listing.address}
            </p>
            {lat !== undefined && lng !== undefined && (
              <a
                href={`https://www.google.com/maps?q=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg mt-3 cursor-pointer"
              >
                Open in Google Maps
              </a>
            )}
          </div>

          <div className="detail-section-card border-none">
            <p className="text-xs font-semibold text-brand-gray-light uppercase tracking-wide mb-3">
              Seller
            </p>

            {!seller ? (
              <p className="text-sm text-brand-gray-light">
                No seller attached to this listing.
              </p>
            ) : (
              <>
                <div className="flex items-center gap-2.5 mb-3">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #D19E00, #2563EB)",
                    }}
                  >
                    {getInitials(seller.name)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-gray-dark dark:text-gray-100">
                      {seller.name}
                    </p>
                    <span className="text-xs text-brand-gray-light">
                      <p className="text-xs text-brand-gray-light">
                        {seller.slug} · {seller.email} · {seller.phone}
                      </p>
                    </span>
                  </div>
                </div>

                {/* <div className="profile-info-row">
                  <span className="profile-info-label">Role</span>
                  <span className="profile-info-value">
                    {seller.role ?? NOT_IN_API_YET}
                  </span>
                </div> */}
                <div className="profile-info-row">
                  <span className="profile-info-label">Status</span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      sellerStatusPillClass[seller.status] ?? statusFallback
                    }`}
                  >
                    {formatStatus(seller.status)}
                  </span>
                </div>
                {/* TODO: seller company is not returned by the API */}
                <div className="profile-info-row">
                  <span className="profile-info-label">Name</span>
                  <span className="profile-info-value">{seller.name}</span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Total Listings</span>
                  <span className="profile-info-value">
                    {seller.totalListings}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Member Since</span>
                  <span className="profile-info-value">
                    {formatDate(seller.createdAt)}
                  </span>
                </div>
                <div className="profile-info-row">
                  <span className="profile-info-label">Rating</span>
                  <span className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < Math.round(Number(seller.rating) || 0)
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
                  onClick={() => navigate(`/users/${seller.id}`)}
                  className="w-full bg-[#BFDBFE] text-brand-blue text-sm font-medium py-2.5 rounded-lg mt-3 cursor-pointer"
                >
                  View All Listings
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {emailModalOpen && seller && (
        <EmailSellerModal
          sellerName={seller.name}
          listingTitle={listing.title}
          isSubmitting={isSendingEmail}
          onClose={() => setEmailModalOpen(false)}
          onConfirm={handleSendEmail}
        />
      )}

      {editModalOpen && (
        <EditListingModal
          title={listing.title}
          price={listing.price}
          isSubmitting={isUpdating}
          onClose={() => setEditModalOpen(false)}
          onConfirm={handleConfirmEdit}
        />
      )}
    </div>
  );
}
