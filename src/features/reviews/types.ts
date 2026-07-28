export interface ReviewRow {
  id: string;
  reviewerName: string;
  reviewerAvatarUrl?: string;
  reviewerId: string;
  reviewerEmail: string;
  reviewerCompany: string;
  listingName: string;
  listingCode: string;
  listingImageUrl?: string;
  listingSubmittedDate: string;
  rating: number;
  comment: string;
  status: "Published" | "Flagged";
  date: string;
}