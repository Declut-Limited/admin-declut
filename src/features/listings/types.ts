export interface ListingSeller {
  id: string;
  name: string;
  contact: string;
  role: string;
  status: string;
  listingsCount: number;
  totalListings:  number;
  createdAt: string;
  rating: string;
}

export interface ListingCategory {
  _id: string;
  title: string;
  slug: string;
}
export interface ListingRow {
  _id: string;
  seller: ListingSeller | null;
  title: string;
  description: string;
  category: ListingCategory | null;
  condition: string;
  price: number;
  images: string[];
  location: { type: string; coordinates: [number, number] };
  locationLabel: string;
  status: string;
  slug?: string; // older records have no slug
  views: number;
  saves: number;
  priceHistory: { price: number; changedAt: string }[];
  specs?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ListingsListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface ListingsListResponse {
  success: boolean;
  data: {
    results: ListingRow[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface ListingImage {
  id: string;
  url: string;
  isVideo?: boolean;
}

export interface ListingActivityEvent {
  _id: string;
  entityType: string;
  entityId: string;
  event: string;
  actor: string;
  newState: string;
  createdAt: string;
}


export interface ListingReview {
  reviewerName: string;
  reviewerId: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
}

export interface ListingSaleDetails {
  buyer: string;
  amountPaid: string;
  paymentMethod: string;
  transactionStatus: string;
  soldOn: string;
}

// export interface ListingDetail {
//   id: string;
//   code: string;
//   name: string;
//   status: "Active" | "Pending Review" | "Flagged" | "Sold" | "Delisted";
//   category: string;
//   postedDate: string;
//   views: number;
//   saves: number;
//   price: string;
//   condition: string;
//   payoutAfterCommission: string;
//   commissionPercent: string;
//   images: ListingImage[];
//   description: string;
//   brand: string;
//   itemCondition: string;
//   quantityAvailable: number;
//   sku: string;
//   saleDetails?: ListingSaleDetails; // only when Sold
//   review?: ListingReview; // only when Sold
//   activity: ListingActivityEvent[];
//   location: {
//     address: string;
//     landmark: string;
//     lat: number;
//     lng: number;
//   };
//   seller: {
//     name: string;
//     id: string;
//     email: string;
//     avatarUrl?: string;
//     role: string;
//     status: "Active" | "Suspended";
//     company: string;
//     totalListings: number;
//     memberSince: string;
//     rating: number;
//   };
// }

export interface ListingDetailData {
  images: { url: string }[];
  title: string;
  status: string;
  category: ListingCategory | null;
  createdAt: string;
  views: number;
  saves: number;
  price: number;
  address: string;
  description: string;
  specs: Record<string, unknown> | null;
  priceHistory: { price: number; changedAt: string }[];
  recentActivity: ListingActivityEvent[];
  seller: ListingSeller | null;

  // TODO: present on the list endpoint, backend adding them here
  slug?: string;
  locationLabel?: string;
  location?: { type: string; coordinates: [number, number] };
  condition?: string;
}

export interface ListingDetailResponse {
  success: boolean;
  data: ListingDetailData;
}

export interface EmailSellerPayload {
  subject: string;
  message: string;
}