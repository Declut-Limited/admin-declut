export type ReviewStatus = "visible" | "flagged" | "resolved";

export interface ReviewListing {
  id: string;
  title: string;
  mainImage: string;
  slug: string;
  createdAt: string;
}

export interface ReviewReviewer {
  id: string;
  name: string;
  email: string;
  slug: string;
  role: string;
  status: string;
}

export interface ReviewRow {
  _id: string;
  transaction: string;
  listing: ReviewListing | null;
  reviewer: ReviewReviewer | null;
  reviewee: string;
  role: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface ReviewsListParams {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReviewsListResponse {
  success: boolean;
  data: {
    results: ReviewRow[];
    total: number;
    page: number;
    limit: number;
  };
}