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

export interface ListingMedia {
  publicId: string;
  url: string;
  secureUrl: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ListingRowSeller {
  _id: string;
  name: string;
}

export interface ListingRowCategory {
  _id: string;
  title: string;
}

export interface ListingRow {
  _id: string;
  seller: ListingRowSeller | null;
  title: string;
  description: string;
  category: ListingRowCategory | null;
  price: number;
  images: ListingMedia[];
  mainImageUrl: string | null;
  video: ListingMedia | null;
  locationLabel: string;
  address: string;
  state: string;
  area: string;
  hasDefect: boolean;
  defectDescription: string | null;
  status: string;
  slug: string;
  specs?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ListingDetailData {
  id: string;
  slug: string;
  images: ListingMedia[];
  video: ListingMedia | null;
  mainImageUrl: string | null;
  title: string;
  status: string;
  category: ListingCategory | null;
  createdAt: string;
  views: number;
  saves: number;
  price: number;
  address: string;
  location: { type: string; coordinates: [number, number] };
  locationLabel: string;
  description: string;
  specs: Record<string, unknown> | null;
  priceHistory: { price: number; changedAt: string }[];
  recentActivity: ListingActivityEvent[];
  seller: ListingDetailSeller | null;
}


export interface ListingsListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
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
  posterUrl?: string;
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

export interface UpdateListingPayload {
  title: string;
  price: number;
}