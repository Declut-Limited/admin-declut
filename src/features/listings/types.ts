export interface ListingRow {
  id: string;
  name: string;
  code: string;
  category: string;
  sellerName: string;
  sellerInitials: string;
  price: string;
  location: string;
  date: string;
  status: "Active" | "Pending Review" | "Flagged" | "Sold" | "Delisted";
}

export interface ListingImage {
  id: string;
  url: string;
  isVideo?: boolean;
}

export interface ListingActivityEvent {
  id: string;
  label: string;
  date: string;
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

export interface ListingDetail {
  id: string;
  code: string;
  name: string;
  status: "Active" | "Pending Review" | "Flagged" | "Sold" | "Delisted";
  category: string;
  postedDate: string;
  views: number;
  saves: number;
  price: string;
  condition: string;
  payoutAfterCommission: string;
  commissionPercent: string;
  images: ListingImage[];
  description: string;
  brand: string;
  itemCondition: string;
  quantityAvailable: number;
  sku: string;
  saleDetails?: ListingSaleDetails; // only when Sold
  review?: ListingReview; // only when Sold
  activity: ListingActivityEvent[];
  location: {
    address: string;
    landmark: string;
    lat: number;
    lng: number;
  };
  seller: {
    name: string;
    id: string;
    email: string;
    avatarUrl?: string;
    role: string;
    status: "Active" | "Suspended";
    company: string;
    totalListings: number;
    memberSince: string;
    rating: number;
  };
}