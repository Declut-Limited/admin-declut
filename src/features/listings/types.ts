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

export interface ListingDetailResponse {
  success: boolean;
  data: ListingDetailData;
}

export interface EmailSellerPayload {
  subject: string;
  message: string;
}

export interface ListingDetailSeller {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  totalListings: number;
  rating: string;
  createdAt: string;
}

export interface ListingDetailData {
  id: string;
  slug: string;
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
  seller: ListingDetailSeller | null;

  // TODO: present on the list endpoint, not the detail one
  locationLabel?: string;
  location?: { type: string; coordinates: [number, number] };
  condition?: string;
}

export interface UpdateListingPayload {
  title: string;
  price: number;
}